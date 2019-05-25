import { isObj, mapObj } from './object_util'
import { validateMatchType } from './validate_util'
import { Values } from '../constants'

const getTypeStyles = (settings, Type) => (
  Type &&
      Type.hasOwnProperty('getStyles') &&
      settings.styleLoader &&
      settings.styleLoader.add &&
      settings.styleLoader.add(Type.name, Type.getStyles(settings))
)

export const initTypeCache = (TypesCls, settings, loadedTypes) => {
  const { BaseType, subTypes, types } = loadedTypes
  if(!validateMatchType(BaseType)) return

  const rootTypes = { ...types }
  const joinedSubTypes = { ...subTypes, ...settings.customTypes }
  TypesCls.BaseType = new BaseType(settings.types.base)
  return buildTypeCache(
    settings,
    { rootTypes, subTypes: joinedSubTypes, BaseType: TypesCls.BaseType }
  )
}

export const buildTypeCache = (settings, allTypes) => {
  const { rootTypes, subTypes, BaseType } = allTypes  
  const BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor
  }
  // Ensure the styles get loaded for the base
  getTypeStyles(settings, BaseType.constructor)


  BaseTypeMeta.children = Object
    .entries(rootTypes)
    .reduce((allTypes, [ name, factory ]) => {
      if(!validateMatchType(factory)) return allTypes
      
      allTypes[name] = {
        name,
        factory,
        extends: BaseTypeMeta
      }
      // Ensure the styles get loaded for each type factory
      getTypeStyles(settings, factory)

      if(subTypes[name])
        allTypes[name].children = Object.freeze(
          buildSubTypes(
            subTypes[name],
            allTypes[name],
            settings
          )
        )
      Object.freeze(allTypes[name])
      
      return allTypes
    }, {})

  Object.defineProperty(BaseTypeMeta.children, Values.MAP_TYPES, {
    value: (cb, parent) => mapObj(parent, cb),
    enumerable: false,
  })

  BaseTypeMeta.children = Object.freeze(BaseTypeMeta.children)
  return BaseTypeMeta
}

export const buildTypeName = typeClsName => (
  typeClsName.split('Type').join('').toLowerCase()
)

const buildSubTypes = (subTypes, parentMeta, settings) => (
  Object
  .values(subTypes)
  .reduce((built, subType) => {
    if(!validateMatchType(subType)) return built

    const typeName = buildTypeName(subType.name)
    built[typeName] = {
      name: typeName,
      factory: subType,
      extends: parentMeta
    }
    // Ensure the styles get loaded for each sub type factory
    getTypeStyles(settings, subType)

    return built
  }, parentMeta.subTypes || {})
)

export const typesOverride = (typeInstance, config) => {
  if(!config) return null

  Object.entries(Values.TYPE_OVERWRITE).map(([ key, type ]) => (
    typeof config[key] === type &&
      typeInstance[key] !== config[key] &&
      (typeInstance[key] = config[key])
  ))
}