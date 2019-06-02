import { mapObj, uuid, logData } from 'jsUtils'
import { validateMatchType } from './validate_util'
import { Values } from '../constants'

const getTypeStyles = (settings, Type) => (
  Type &&
      Type.hasOwnProperty('getStyles') &&
      settings.styleLoader &&
      settings.styleLoader.add &&
      settings.styleLoader.add(buildStyleId(Type), Type.getStyles(settings))
)

const buildStyleId = Type => {
  Type.styleId = `${Type.name.toLowerCase()}-${uuid().split('-').pop()}`
  return Type.styleId
}

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

export const loadDynamicTypes = (typesPath) => {
  return import(
    /* webpackInclude: /\.js$/ */
    /* webpackMode: "lazy" */
    /* webpackChunkName: "jtree-definitions" */
    `../../node_modules/jtree-definitions/build/${typesPath}`
    )
    .then(type => {
      if(!type || !type.default)
        logData('Could not load types, please ensure they are properly installed!')

        return type && type.default || {}
    })
}

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

export const buildFlatTypes = (startType, opts={}, flatTypes={}) => {
  if(!startType)
    return flatTypes || {}

  const filter = Array.isArray(opts.filter) && opts.filter || []
  return Object
    .entries((startType).children)
    .reduce((flatList, [ key, obj ]) => {
      if(filter.indexOf(key) !== -1) return flatList
        
      flatList[key] = obj
      if(obj.children)
        flatList = {
          ...flatList,
          ...buildFlatTypes(obj, {}, flatList)
        }

      return flatList
    }, flatTypes)

}

export const typesOverride = (typeInstance, config) => {
  if(!config) return null

  Object.entries(Values.TYPE_OVERWRITE).map(([ key, type ]) => (
    typeof config[key] === type &&
      typeInstance[key] !== config[key] &&
      (typeInstance[key] = config[key])
  ))
}