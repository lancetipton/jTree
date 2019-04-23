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
    (!instance.render && type.render) ||
    (instance.render && type.render && instance.render !== type.render)
  )
    instance.render = type.render.bind(instance)

  INSTANCE_CACHE[id] = instance 

  return INSTANCE_CACHE[id]
}