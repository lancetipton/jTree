import { types, subTypes, BaseType } from  './default_types'
import {
  buildSubTypes,
  buildTypeCache,
  clearObj,
  deepMerge,
  isConstructor,
  isObj,
  logData,
  mapCb,
  parseJSONString,
  registerTypeRender,
  validateNewType,
} from '../utils'
import { Values } from '../constants'

let TYPE_CACHE = {}

const getMatchTypes = function(value, parent, settings, matches={}){
  TYPE_CACHE.children[Values.MAP_TYPES]((name, meta) => {
    const { factory } = meta
    // Check if there is a match to the value
    if(!factory || !factory.eval || !factory.eval(value)) return
    // Gets the priority from the factory class
    // Or the base priority if none exists for factory
    const priority = factory.priority || this.BaseType.constructor.priority
    // Sets the meta to the matches object
    matches[priority] = matches[priority] || {}
    matches[priority][name] = meta

    // Check If the type have children, nad check them as well
    if(isObj(meta.children))
      getMatchTypes.apply(this, [value, meta.children, settings, matches])

  }, parent || TYPE_CACHE.children)
  
  return matches
}

const buildCache = (Types, settings) => {
  const joinedTypes = { ...types }
  const joinedSubTypes = { ...subTypes, ...settings.customTypes }
  Types.BaseType = new BaseType(settings.types.base)
  TYPE_CACHE = buildTypeCache(joinedTypes, joinedSubTypes, Types.BaseType)
}

export class Types {
  
  constructor(settings){
    registerTypeRender()
    buildCache(this, settings)
  }

  get = () => TYPE_CACHE
  
  clear = () => {
    clearObj(TYPE_CACHE)
    TYPE_CACHE = undefined
    
  }
  
  register = newType => {
    if(!validateNewType(newType, TYPE_CACHE))
      return null
  }

  rebuild = settings => {
    this.clear()
    buildCache(this, settings)
  }
  
  getTypes = (value, settings) => {
    const matchTypes = getMatchTypes.apply(
      this, 
      [
        value,
        TYPE_CACHE.children,
        settings,
        {}
      ]
    )

    const firstKey =  isObj(matchTypes) && Object.keys(matchTypes)[0]
    return firstKey && matchTypes[firstKey]
  }
  
  destroy = (Editor) => {
    clearObj(TYPE_CACHE)
    TYPE_CACHE = undefined
    this.BaseType = undefined
    delete this.BaseType
  }

}

 
