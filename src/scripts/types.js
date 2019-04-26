import {
  addCompProp,
  buildInstance,
  buildTypeName,
  clearObj,
  checkCall,
  checkMultiMatches,
  callMatchHelper,
  deepMerge,
  getMatchTypes,
  initTypeCache,
  isConstructor,
  isObj,
  isFunc,
  logData,
  mapCb,
  parseJSONString,
  uuid,
  validateBuildTypes,
  validateNewType,
} from './utils'
import { Values } from './constants'
import Render from './modules/renders'
import TypeDefs from './modules/types'

let TYPE_CACHE
let LOADED_TYPES
const loadRenderTypes = renderPath => Promise.resolve(
  renderPath && Render.load(
    typeof renderPath === 'string' && renderPath || Values.DEFAULT_RENDERS
  )
)


const buildPos = (key, parent) => (
  key === Values.ROOT
    ? key
    : `${parent.pos}.${key}`
)

const getParentComp = (data) => (
  data.component
    ? data.component
    : isObj(data.parent)
      ? getParentComp(data.parent)
      : null
)

export const loopDataObj = (curSchema, tree, settings, elementCb) => {
  const { value, key, parent } = curSchema
  const matchTypes = settings.Editor.Types.getTypes(value, settings)  
  const type = checkMultiMatches(matchTypes, curSchema, tree, settings)

  // Check if the type has a factory to call, if not just return
  if(!type || !type.factory || !isConstructor(type.factory))
    return tree

  const schema = {
    ...curSchema,
    id: curSchema.id || uuid(),
    matchType: curSchema.matchType || buildTypeName(
      type.name || type.factory.name
    ),
    pos: buildPos(key, parent),
  }
  schema.instance = schema.instance || buildInstance(
    type,
    schema.id,
    schema.matchType,
    settings
  )

    // instance,
  if(key !== Values.ROOT && !schema.parent)
    schema.parent = parent

  tree.schema[schema.pos] = schema
  const props = { schema, tree, settings }
  props.build = isFunc(schema.instance.build) && schema.instance.build(props)

  let component = isObj(value)
    ? schema.instance.render({
        ...props,
        children: Object
          .entries(value)
          .map(([ childKey, child ]) => (
              loopDataObj(
                { value: child, key: childKey, parent: schema },
                tree,
                settings,
                elementCb
              )
          ))
      })
    : Array.isArray(value)
        ? schema.instance.render({
            ...props,
            children: value
              .map((child, index) => (
                loopDataObj(
                  { value: child, key: index, parent: schema },
                  tree,
                  settings,
                  elementCb
                )
              ))
          })
        : schema.instance.render(props)

  // If a component was create, add it to it's schema by id
  if(component){
    // Ensure the component has an Id
    if(!component.id) component.id = schema.id
    // Use the id to set the component prop on the schema
    addCompProp(schema, component.id)
  }
  
  // Add the dom components Id to the idMap
  // This will help with looking up the schema later
  tree.idMap[component && component.id || schema.id] = schema.pos

  
  // If we are not on the root element of the tree, just return the rendered component
  if(key !== Values.ROOT) return component
  // If on the root element, call the appendTree method
  // to add the component tree to the dom
  checkCall(elementCb, component, settings.editor.appendTree)
  component = undefined
  // Then return the build tree
  return tree
}

export const buildTypes = (source, settings, elementCb) => {
  if(!validateBuildTypes(source, settings.Editor)) return null
  
  const tree = { schema: {}, content: source, idMap: {} }
  const rootSchema = { value: source, key: Values.ROOT }
  return loopDataObj(rootSchema, tree, settings, elementCb)
}

export function TypesCls(settings){
  
  class Types {

    get = () => TYPE_CACHE
    
    clear = () => {
      clearObj(TYPE_CACHE)
      clearObj(LOADED_TYPES)
      TYPE_CACHE = undefined
      LOADED_TYPES = undefined
    }
    
    register = newType => {
      if(!validateNewType(newType, TYPE_CACHE))
        return null
    }

    load = typesPath => {
      if(LOADED_TYPES)
        return Promise.resolve(LOADED_TYPES)

      return TypeDefs.load(typesPath || Values.DEFAULT_TYPES)
        .then(loadedTypes => {
          LOADED_TYPES = loadedTypes
          return LOADED_TYPES
        })
    }

    rebuild = () => {
      this.clear()
      TYPE_CACHE = initTypeCache(this, settings)
    }
    
    getTypes = value => {
      const matchTypes = getMatchTypes.apply(
        this, 
        [
          TYPE_CACHE,
          value,
          TYPE_CACHE.children,
          settings,
          {}
        ]
      )

      const firstKey =  isObj(matchTypes) && Object.keys(matchTypes)[0]
      return firstKey && matchTypes[firstKey]
    }
    
    destroy = (Editor) => {
      clearObj(TYPE_CACHE)
      TYPE_CACHE = undefined
      this.BaseType = undefined
      delete this.BaseType
    }

  }
  
  let dnyRenders
  const typesCls = new Types()
  return loadRenderTypes(settings.renderPath)
    .then(renders => {
      dnyRenders = renders
      return typesCls.load(settings.typesPath)
    })
    .then(loadedTypes => {
      TYPE_CACHE = initTypeCache(typesCls, settings, loadedTypes, dnyRenders)
      return typesCls
    })
}
