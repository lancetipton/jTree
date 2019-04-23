import {
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
const loadRenderTypes = renderPath => (
  Render.load(renderPath || Values.DEFAULT_RENDERS)
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

const loopDataObj = (value, key, tree, parent, settings) => {
  const matchTypes = settings.Editor.Types.getTypes(value, settings)  
  const type = checkMultiMatches(matchTypes, value, key, tree, parent, settings)

  // Check if the type has a factory to call, if not just return
  if(!type || !type.factory || !isConstructor(type.factory))
    return tree
  
  const id = uuid()
  const typeName = buildTypeName(type.name || type.factory.name)
  const instance = buildInstance(type, id, typeName, settings)

  const schema = {
    value,
    key,
    id,
    instance,
    matchType: typeName,
    pos: buildPos(key, parent),
  }
  if(key !== Values.ROOT) schema.parent = parent

  tree.schema[schema.id] = schema
  const props = { schema, tree, settings }
  props.build = isFunc(instance.build) && instance.build(props)

  let component = isObj(value)
    ? instance.render({
        ...props,
        children: Object
          .entries(value)
          .map(([ childKey, child ]) => (
              loopDataObj(child, childKey, tree, schema, settings)
          ))
      })
    : Array.isArray(value)
        ? instance.render({
            ...props,
            children: value
              .map((child, index) => (
                loopDataObj(child, index, tree, schema, settings)
              ))
          })
        : instance.render(props)
  
  // If we are not on the root element of the tree, just return the rendered component
  if(key !== Values.ROOT) return component
  // If on the root element, call the appendTree method
  // to add the component tree to the dom
  settings.Editor.appendTree(component, props)

  // Then return the build tree
  return tree
}

export const buildTypes = (source, settings) => {
  if(!validateBuildTypes(source, settings.Editor)) return null
  
  const tree = { schema: {}, content: source }

  return loopDataObj(source, Values.ROOT, tree, { value: tree }, settings)
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

  const typesCls = new Types()
  return loadRenderTypes(settings.renderPath)
    .then(renders => {
      return typesCls.load(settings.typesPath)
    })
    .then(loadedTypes => {
      TYPE_CACHE = initTypeCache(typesCls, settings, loadedTypes)
      return typesCls
    })
}
