import {
  isConstructor,
  logData,
  isObj,
  mapCb
} from './methods'
import { MAP_TYPES } from '../constants'

export const buildTypeCache = (rootTypes, subTypes) => {
  const typeCache = Object
    .entries(rootTypes)
    .reduce((allTypes, [ name, factory ]) => {
      allTypes[name] = {
        name,
        factory
      }
      if(subTypes[name])
        allTypes[name].children = Object.freeze(
          buildSubTypes(subTypes[name], allTypes[name])
        )
      Object.freeze(allTypes[name])
      
      return allTypes
    }, {})

  Object.defineProperty(typeCache, MAP_TYPES, {
    value: (cb, parent) => mapCb(parent, cb),
    enumerable: false,
  })

  return Object.freeze(typeCache)
}

const getParentName = (subType, parentType) =>
  parentType && parentType.name || subType && Object.getPrototypeOf(subType.constructor).name

export const buildTypeName = typeCls => typeCls.name.split('Type').join('').toLowerCase()

export const buildSubTypes = (subTypes, parentMeta) => (
  Object
  .values(subTypes)
  .reduce((built, subType) => {
    if(typeof subType !== 'function' || !subType.name) return built
    const typeName = buildTypeName(subType)
    built[typeName] = {
      name: typeName,
      cast: subType,
      extends: parentMeta
    }

    return built
  }, parentMeta.subTypes || {})
)

export const validateNewType = (newType, TYPE_CACHE) => {
  if(!newType.name)
    return logData(`Type could not be registered. Types require a name property!`, 'error')
  if(TYPE_CACHE[newType.name])
    return logData(`Type with name ${newType.name} already registered!`, 'error')
  if(!isConstructor(newType))
    return logData(`New Types must be a constructor!`, 'error')

  return true
}

export const validateBuildTypes = (data, Editor) => {
  if(!isObj(data))
    return logData(`Could build data. Please make sure data is an Object!`, 'error')

  if(!isObj(Editor.Types) || typeof Editor.Types.get !== 'function')
    return logData(`Editor.Types class is requires when building the editor types!`, 'error')
  
  return true
}