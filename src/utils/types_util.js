import { mapObj, uuid, get } from 'jsUtils'
import { validateMatchType } from './validate_util'
import Constants from '../constants'

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

/**
 * Builds the passed in types to be used with the Main TypeClass
 * @param { class instance } TypesCls - built TypeClass instance
 * @param { object } settings - settings passed into the jTree init method
 * 
 * @returns { object } - built Types to use in the editor
 */
export const initTypeCache = (TypesCls, settings) => {
  const { BaseType, ...allTypes } = get(settings.types, 'definitions') || {}
  if(!validateMatchType(BaseType)) return

  TypesCls.BaseType = new BaseType(get(settings.types, 'config.base') || {})
  return buildTypeCache(
    settings,
    { ...allTypes, BaseType: TypesCls.BaseType }
  )
}

const getExtends = factory => {
  const parent = factory.__proto__ && get(factory.__proto__, 'prototype.constructor')
  return parent && {
    name: parent.name,
    base: parent,
    factory: parent.constructor
  }
}

/**
 * Formats the passed in types to be used in the jTree Editpr
 * @param { object } settings - settings passed into the jTree init method
 * @param { object } allTypes - types to be formatted
 * 
 * @returns { object } - formatted Types to use in the editor
 */
export const buildTypeCache = (settings, types) => {

  const { BaseType, ...allTypes } = types
  const BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor
  }
  
  // Ensure the styles get loaded for the base
  getTypeStyles(settings, BaseType.constructor)

  const builtTypes = Object
    .entries(allTypes)
    .reduce((types, [ name, factory ]) => {
      const useName = buildTypeName(name)
      if(!validateMatchType(factory)) return allTypes
      
      types[useName] = {
        name: useName,
        factory,
        extends: getExtends(factory, types) || BaseTypeMeta
      }

      // Ensure the styles get loaded for each type factory
      getTypeStyles(settings, factory)

      return types
    }, {})

  Object.defineProperty(builtTypes, Constants.Values.MAP_TYPES, {
    value: (cb, parent) => mapObj(parent, cb),
    enumerable: false,
  })

  return Object.freeze(builtTypes)
}

/**
 * Formats the type name to not include the word `Type`
 * @param { string } typeClsName - Name of the type class
 * 
 * @returns { string } - name without the word `Type`
 */
export const buildTypeName = typeClsName => (
  typeClsName.split('Type').join('').toLowerCase()
)


/**
 * Overrides a types default attribute with a custom one
 * attribute must be included in the TYPE_OVERWRITE constant
 * @param { class instance } typeInstance - created from a Type class
 * @param { object } config - passed in setting for this Type
 * 
 * @returns { void }
 */
export const typesOverride = (typeInstance, config) => {
  if(!config) return null

  Object.entries(Constants.Values.TYPE_OVERWRITE).map(([ key, type ]) => (
    typeof config[key] === type &&
      typeInstance[key] !== config[key] &&
      (typeInstance[key] = config[key])
  ))
}