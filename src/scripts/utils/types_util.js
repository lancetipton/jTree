import { isObj, mapCb } from './object_util'
import { Values } from '../constants'
import Render from '../modules/renders'

export const initTypeCache = (TypesCls, settings, { BaseType, subTypes, types }) => {
  const joinedTypes = { ...types }
  const joinedSubTypes = { ...subTypes, ...settings.customTypes }
  TypesCls.BaseType = new BaseType(settings.types.base)
  return buildTypeCache(joinedTypes, joinedSubTypes, TypesCls.BaseType)
}

export const buildTypeCache = (rootTypes, subTypes, BaseType) => {
  const typeRender = Render.get() || {}

  const BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor,
    render: typeRender.base
  }

  BaseTypeMeta.children = Object
    .entries(rootTypes)
    .reduce((allTypes, [ name, factory ]) => {
      allTypes[name] = {
        name,
        factory,
        extends: BaseTypeMeta,
        render: typeRender[name] || typeRender.base
      }
      if(subTypes[name])
        allTypes[name].children = Object.freeze(
          buildSubTypes(subTypes[name], allTypes[name], typeRender)
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

const buildSubTypes = (subTypes, parentMeta, typeRender) => (
  Object
  .values(subTypes)
  .reduce((built, subType) => {
    if(typeof subType !== 'function' || !subType.name) return built
    const typeName = buildTypeName(subType.name)
    built[typeName] = {
      name: typeName,
      cast: subType,
      extends: parentMeta,
      render: typeRender[typeName] || parentMeta.render
    }

    return built
  }, parentMeta.subTypes || {})
)

export const typesOverride = (Type, config) => {
  Object.entries(Values.TYPE_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && Type[key] !== config[key])
      Type[key] = config[key]
  })
}