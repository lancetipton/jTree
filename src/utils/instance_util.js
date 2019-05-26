import { clearObj, isObj, addProp, mapObj } from './object_util'
import { typesOverride } from './types_util'
import { isFunc, checkCall } from './methods_util'
import { clearSchema } from './clean_util'
import { Schema, Values } from 'jTConstants'
import _unset from 'lodash.unset'

let INSTANCE_CACHE

const getChildSchema = (key, value, { tree, schema }) => ({ 
  ...(tree.schema[buildInstancePos(key, schema)] || {}),
  key,
  value,
  parent: schema,
})

const buildChild = (childKey, child, props, loopChildren) => {

  if(props.schema.open)
    return loopChildren(
      getChildSchema(childKey, child, props),
      props.tree,
      props.settings
    )
  
  const childPos = buildInstancePos(childKey, props.schema)  
  const schema = props.tree.schema[childPos]
  if(!schema || !schema.instance || !schema.component) return

  clearSchema(schema, props.tree.schema)

  return undefined
}

export const buildInstancePos = (key, parent) => (
  key === Schema.ROOT
    ? key
    : `${parent.pos}.${key}`
)

export const clearInstanceCache = () => {
  clearObj(INSTANCE_CACHE)
  INSTANCE_CACHE = undefined
}

export const getInstanceCache = id => (
  id && INSTANCE_CACHE[id] || INSTANCE_CACHE
)

/**
 * Removes an instance from the instance cache
 * @param  {any} id - id of the instance to be removed
 * @return { boolean } - if the instance was removed
 */
export const clearInstance = (id, instance) => {
  instance = instance || INSTANCE_CACHE[id]
  if(!instance) return false

  isFunc(instance.componentWillUnmount) &&
    instance.componentWillUnmount()

  instance.state = undefined
  instance.setState = undefined
  clearObj(instance)
  
  id = id || Object.keys(INSTANCE_CACHE)[
    Object.values(INSTANCE_CACHE).indexOf(instance)
  ]
  
  id && (INSTANCE_CACHE[id] = undefined)
  id && _unset(INSTANCE_CACHE, id)
  instance = undefined
  
  return true
}

export const buildInstance = (type, schema, settings) => {
  const { id, matchType } = schema
  
  INSTANCE_CACHE = INSTANCE_CACHE || {}

  // Check for cached instance
  if(!INSTANCE_CACHE[id]){
    // Get the config from the passed in settings
    const config = settings.types && settings.types[matchType] || {}
    const editorConfig = settings.Editor.config || {}
    // Add editor methods to the instance if none defined
    mapObj(Values.CUSTOM_EVENTS, (key, value) => (
      !config[key] && editorConfig[key] && (config[key] = editorConfig[key])
    ))

    // If no cached instance, built new one from factory
    const instance = new type.factory(config, settings.Editor)
    // Check for config overrides from the passed in settings
    config && typesOverride(instance, settings.types[matchType])

    // Wrap the methods on the instance, so we can pass the Editor into them when called
    Object.keys(instance).map(key => {
      if(!isFunc(instance[key])) return

      const orgMethod = instance[key]
      instance[key] = (...args) => {
        if(!Values.CUSTOM_EVENTS[key])
          return orgMethod(...args, settings.Editor)

        let callOrg = false
        let hasOverride = isFunc(editorConfig[key])
        if(hasOverride){
          if(editorConfig.eventOverride === 'instance')
            callOrg = true
          else if(settings.Editor.config[key](...args, settings.Editor) !== false)
            callOrg = true
        }

        if(!hasOverride || callOrg)
          return orgMethod(...args, settings.Editor)
      }
    })

    // Add the instance to the instance cache
    INSTANCE_CACHE[id] = instance
  }
  
  // Add the new instance prop
  let NEW_INSTANCE = true
  addProp(schema, 'newInstance', {
    get: () => NEW_INSTANCE,
    set: update => {
      NEW_INSTANCE = undefined
      _unset(schema, 'newInstance')
    },
    enumerable: true,
    configurable: true,
  })

  // Add instance look up to the schema
  addProp(schema, 'instance', {
    get: () => (INSTANCE_CACHE[id]),
    set: instance => {
      if(!instance){
        clearInstance(id)
        _unset(schema, 'instance')
      }
      else INSTANCE_CACHE[id] = instance
    },
    enumerable: true,
    configurable: true,
  })
  
  return INSTANCE_CACHE[id]
}

export const renderInstance = (key, value, props, loopChildren) => {
  const { schema, tree, settings } = props
  let component = isObj(value)
    ? checkCall(schema.instance.render, {
      ...props,
      children: Object
        .entries(value)
        .map(([ childKey, child ]) => buildChild(childKey, child, props, loopChildren))
    })
    : Array.isArray(value)
        ? checkCall(schema.instance.render, {
            ...props,
            children: value
              .map((child, index) => buildChild(index, child, props, loopChildren))
          })
        : checkCall(schema.instance.render, props)

  // If a component was created, add it to it's schema by id
  // Ensure the component has an Id
  component && !component.id && (component.id = schema.id)

  return component
}

export const callInstanceUpdates = (tree, orgPos) => (
  Object
    .entries(tree.schema)
    .map(([ pos, schema ]) => (
      // Check if the update schema pos exists within the current schema pos
      // This would mean the updated schema is a parent to the current schema
      !schema.instance || schema.pos.indexOf(orgPos) !== 0
        ? null
        : !schema.newInstance
          // If it's not a new instance, call the update method
          ? isFunc(schema.instance.componentDidUpdate) &&
              schema.instance.componentDidUpdate({
                tree: tree,
                schema,
                parent: schema.parent,
              })
          // Otherwise, set newInstance to false, and call the mounting method
          : (schema.newInstance = false) ||
              isFunc(schema.instance.componentDidMount) &&
                schema.instance.componentDidMount({
                    tree: tree,
                    schema,
                    parent: schema.parent,
                  })
    ))
)