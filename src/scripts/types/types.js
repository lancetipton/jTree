import { types, subTypes } from  './default_types'
import {
  buildSubTypes,
  buildTypeCache,
  clearObj,
  deepMerge,
  isObj,
  logData,
  mapCb,
  parseJSONString,
  isConstructor,
  validateNewType,
} from '../utils'
import { MAP_TYPES } from '../constants'

let TYPE_CACHE = {}

const getMatchTypes = (value, parent=TYPE_CACHE, settings, matches={}) => {
  TYPE_CACHE[MAP_TYPES]((name, meta) => {
    const { factory } = meta
    if(!factory || !factory.eval) return
    const isValid = factory.eval(value)
    if(!isValid) return
    const match = new factory(settings)
    const priority = match.getPriority() || settings.priorities.default || 0
    matches[priority] = matches[priority] || {}
    matches[priority][name] = { meta, match }
    
    if(isObj(meta.children))
      getMatchTypes(value, meta.children, settings, matches)

  }, parent)
  
  return matches
}

export class Types {
  
  constructor(custom = {}){
    const joinedTypes = { ...types, ...custom.types }
    const joinedSubTypes = { ...subTypes, ...custom.subTypes }
    TYPE_CACHE = buildTypeCache(joinedTypes, joinedSubTypes)
  }

  get = () => TYPE_CACHE
  
  clear = () => {
    clearObj(TYPE_CACHE)
    TYPE_CACHE = undefined
    TYPE_CACHE = buildTypeCache({}, {})
  }
  
  register = newType => {
    if(!validateNewType(newType, TYPE_CACHE))
      return null
  }

  getTypes = (value, settings) => {
    const matchTypes = getMatchTypes(value, TYPE_CACHE, settings, {})
    return !isObj(matchTypes)
      ? logData(`Could not find any types to match value ${value}`, 'warn')
      : matchTypes
  }

}

 
