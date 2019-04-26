import { clearObj } from './object_util'

let INSTANCE_CACHE
export const clearInstanceCache = () => {
  clearObj(INSTANCE_CACHE)
  INSTANCE_CACHE = undefined
}

export const getInstanceCache = id => (
  id && INSTANCE_CACHE[id] || INSTANCE_CACHE
)
  
export const buildInstance = (type, id, typeName, settings) => {
  INSTANCE_CACHE = INSTANCE_CACHE || {}
  const instance = INSTANCE_CACHE[id] ||  new type.factory(settings.types[typeName])
  if(
    // If dynamic render path is set, and the type has a render loaded
    // And the instance.render is not already set as the type.render
    (settings.renderPath && type.render && instance.render !== type.render) ||
    // Or if no instance.render exists, and a type render does, use it
    (!instance.render && type.render)
  )
    instance.render = type.render.bind(instance)

  INSTANCE_CACHE[id] = instance 

  return INSTANCE_CACHE[id]
}


export const addCompProp = (schema, id) => {
  schema && Object.defineProperty(schema, 'component', {
    get: () => (document.getElementById(id)),
    set: _id => {
      if(_id && _id !== id) id = _id
    },
    enumerable: true,
  })

}