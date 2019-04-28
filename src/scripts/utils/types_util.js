import { isObj, mapCb } from './object_util'
import { Values } from '../constants'

const getTypeStyles = (settings, Type) => (
  Type &&
      Type.hasOwnProperty('getStyles') &&
      settings.styleLoader &&
      settings.styleLoader.add &&
      settings.styleLoader.add(Type.name, Type.getStyles(settings))
)

export const initTypeCache = (TypesCls, settings, loadedTypes, renders) => {
  const { BaseType, subTypes, types } = loadedTypes
  const rootTypes = { ...types }
  const joinedSubTypes = { ...subTypes, ...settings.customTypes }
  TypesCls.BaseType = new BaseType(settings.types.base)
  return buildTypeCache(
    settings,
    { rootTypes, subTypes: joinedSubTypes, BaseType: TypesCls.BaseType },
    renders,
  )
}

export const buildTypeCache = (settings, allTypes, renders) => {
  const { rootTypes, subTypes, BaseType } = allTypes
  const typeRender = renders || {}
  
  const BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor,
    render: typeRender.base,
  }
  // Ensure the styles get loaded for the base
  getTypeStyles(settings, BaseType.constructor)


  BaseTypeMeta.children = Object
    .entries(rootTypes)
    .reduce((allTypes, [ name, factory ]) => {
      allTypes[name] = {
        name,
        factory,
        extends: BaseTypeMeta,
        render: typeRender[name] || typeRender.base
      }
      // Ensure the styles get loaded for each type factory
      getTypeStyles(settings, factory)

      if(subTypes[name])
        allTypes[name].children = Object.freeze(
          buildSubTypes(
            subTypes[name],
            allTypes[name],
            typeRender,
            settings
          )
        )
      Object.freeze(allTypes[name])
      
      return allTypes
    }, {})

  Object.defineProperty(BaseTypeMeta.children, Values.MAP_TYPES, {
    value: (cb, parent) => mapCb(parent, cb),
    enumerable: false,
  })

  BaseTypeMeta.children = Object.freeze(BaseTypeMeta.children)
  return BaseTypeMeta
}

export const buildTypeName = typeClsName => (
  typeClsName.split('Type').join('').toLowerCase()
)

const buildSubTypes = (subTypes, parentMeta, typeRender, settings) => (
  Object
  .values(subTypes)
  .reduce((built, subType) => {
    if(typeof subType !== 'function' || !subType.name) return built
    const typeName = buildTypeName(subType.name)
    built[typeName] = {
      name: typeName,
      factory: subType,
      extends: parentMeta,
      render: typeRender[typeName] || parentMeta.render
    }
    // Ensure the styles get loaded for each sub type factory
    getTypeStyles(settings, subType)

    return built
  }, parentMeta.subTypes || {})
)

export const typesOverride = (Type, config) => {
  Object.entries(Values.TYPE_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && Type[key] !== config[key])
      Type[key] = config[key]
  })
}