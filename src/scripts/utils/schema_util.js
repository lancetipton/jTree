import { clearObj } from './object_util'
import { typesOverride } from './types_util'
import { isFunc } from './methods_util'
import _unset from 'lodash.unset'

let INSTANCE_CACHE
export const clearInstanceCache = () => {
  clearObj(INSTANCE_CACHE)
  INSTANCE_CACHE = undefined
}

export const getInstanceCache = id => (
  id && INSTANCE_CACHE[id] || INSTANCE_CACHE
)

export const clearInstance = id => {
  if(!id || !INSTANCE_CACHE[id]) return
  isFunc(INSTANCE_CACHE[id].componentWillUnmount) &&
    INSTANCE_CACHE[id].componentWillUnmount()

  _unset(INSTANCE_CACHE, id)
}

 
export const buildInstance = (type, schema, settings) => {
  const { id, matchType } = schema
  
  INSTANCE_CACHE = INSTANCE_CACHE || {}
  // Check for cached instance
  if(!INSTANCE_CACHE[id]){
    // Get the config from the passed in settings
    const config = settings.types && settings.types[matchType]
    // If no cached instance, built new one from factory
    const instance = new type.factory(config)
    // Check for config overrides from the passed in settings
    config && typesOverride(instance, settings.types[matchType])
    // If dynamic render path is set, and the type has a render loaded
    // And the instance.render is not already set as the type.render
    // Or if no instance.render exists, and a type render does, use it
    if(
      (settings.renderPath && type.render && instance.render !== type.render) ||
      (!instance.render && type.render)
    )
      instance.render = type.render.bind(instance)
    

    const editor = settings.editor || {}
    // Wrap the methods on the instance, so we can pass the Editor into them when called
    Object.keys(instance).map(key => {
      if(!isFunc(instance[key])) return
      const oldMethod = instance[key]
      
      instance[key] = (...args) => {
        const hasOverride = isFunc(editor[key])
        if( !hasOverride || settings.editor[key](...args) !== false )
          return oldMethod(...args, settings.Editor)
      }
    })

    // Add the instance to the instance cache
    INSTANCE_CACHE[id] = instance
  }
  
  
  return addSchemaInstance(schema, id)
}


export const addSchemaInstance = (schema, id) => {
  schema && Object.defineProperty(schema, 'instance', {
    get: () => (INSTANCE_CACHE[id]),
    set: instance => {
      !instance
        ? clearInstance(id)
        : (INSTANCE_CACHE[id] = instance)
    },
    enumerable: true,
    configurable: true,
  })
}

export const addCompProp = (schema, id) => {
  schema && Object.defineProperty(schema, 'component', {
    get: () => (document.getElementById(id)),
    set: _id => {
      if(_id && _id !== id) id = _id
    },
    enumerable: true,
    configurable: true,
  })

}