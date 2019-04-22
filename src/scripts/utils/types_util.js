import { isConstructor, logData } from './methods_util'
import { isObj, mapCb } from './object_util'
import JSRender from '../renders/js'
import Render from '../renders'
import { Values } from '../constants'

export const registerTypeRender = render => Render.register(render || JSRender)

export const buildTypeCache = (rootTypes, subTypes, BaseType) => {
  const typeRender = Render.get()

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

export const buildSubTypes = (subTypes, parentMeta, typeRender) => (
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