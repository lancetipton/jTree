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
} from 'jTUtils'

import { Values } from 'jTConstants'
import Render from './modules/renders'
import TypeDefs from './modules/types'
import stylesReset from './styles_reset.css'
import StyleLoader from 'styleloader'
const styleLoader = new StyleLoader()

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

const renderComponent = (key, value, props) => {
  const { schema, tree, settings } = props
  let component = isObj(value)
    ? schema.instance.render({
        ...props,
        children: Object
          .entries(value)
          .map(([ childKey, child ]) => (
              loopDataObj(
                { value: child, key: childKey, parent: schema },
                tree,
                settings
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
                  settings
                )
              ))
          })
        : schema.instance.render(props)

  // If a component was created, add it to it's schema by id
  if(component){
    // Ensure the component has an Id
    if(!component.id) component.id = schema.id
    // Use the id to set the component prop on the schema
    addCompProp(schema, component.id)
  }

  return component
}

const buildSchema = (curSchema, type, pos, settings) => {
  const schema = {
    ...curSchema,
    pos,
    id: curSchema.id || uuid(),
    matchType: curSchema.matchType || buildTypeName(
      type.name || type.factory.name
    )
  }
  !schema.instance && buildInstance(
    type,
    schema,
    settings
  )

  return schema
}

const checkPropsChange = (props, check) => (
  props && Object.keys(props).map(key => {
    if(props[key] !== check[key]) {
      throw new Error(`Props should not be changed when rendering a component!`)
    }
    
    if(typeof props[key] === 'object' && Values.PROPS_CHECK.indexOf(key) === -1)
      checkPropsChange(props[key], check[key])
  })
)

export const loopDataObj = (curSchema, tree, settings, elementCb) => {
  const { value, key, parent } = curSchema
  const matchTypes = settings.Editor.Types.getTypes(value, settings)  
  const type = checkMultiMatches(matchTypes, curSchema, tree, settings)

  // Check if the type has a factory to call, if not just return
  if(!type || !type.factory || !isConstructor(type.factory))
    return tree
  
  // Build an updated schema based on the new settings
  const schema = buildSchema(
    curSchema,
    type,
    buildPos(key, parent),
    settings
  )

    // If not the root element, set the parent to the schema
  key !== Values.ROOT && (schema.parent = parent)
  
  // If an old schema exists at this pos, clear it out
  // Add the schema to the tree based on pos
  tree.schema[schema.pos] = schema
  // Props helper to make it easier to manage
  let props = { schema, tree, settings }
  // Check if there is a build method, and is so call it
  let shouldUpdate = true
  isFunc(schema.instance.shouldComponentUpdate) && (
    shouldUpdate = schema.instance.shouldComponentUpdate(props)
  )
  
  if(shouldUpdate === false){
    isFunc(schema.instance.componentWillUnmount) &&
      schema.instance.componentWillUnmount(props, schema.component)
    // Should make instance a defined prop like component
    // Then in the getters and setters, have it update the instance cache
    schema.instance = undefined
    tree.idMap[schema.id] = schema.pos
    props = undefined
    return ''
  }
  
  checkPropsChange(props, {
    tree,
    schema,
    settings
  })

  // Render the component and it's children
  let component = renderComponent(
    key,
    value,
    props
  )
  // Add the dom components Id to the idMap
  // This will help with looking up the schema later
  tree.idMap[component && component.id || schema.id] = schema.pos
  // If we are not on the root element of the tree, 
  // Ensure the props get cleared out and return the rendered component
  if(key !== Values.ROOT){
    isFunc(schema.instance.componentDidUpdate) && 
      schema.instance.componentDidUpdate(props, component)

    return (props = undefined) || component
  }
  
  // Only the root component should get to this point
  // Call the appendTree method to add the component tree to the dom
  elementCb && checkCall(elementCb, component, settings.editor.appendTree)
  // Set component and props to undefined, to ensure it get's cleaned up
  // as it's longer being used
  component = undefined
  props = undefined

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
      styleLoader.destroy()
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
      settings.styleLoader = styleLoader
      styleLoader.add(`jt-style-reset`, stylesReset)
      TYPE_CACHE = initTypeCache(
        typesCls,
        settings,
        loadedTypes,
        dnyRenders
      )

      return typesCls
    })
}
