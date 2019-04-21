import { types, subTypes } from  './default_types'
import {
  buildSubTypes,
  buildTypeCache,
  clearObj,
  isObj,
  logData,
  mapCb,
  parseJSONString,
  isConstructor,
  validateNewType,
} from '../utils'

let TYPE_CACHE = {}


export class Types {
  
  constructor(custom = {}){
    const joinedTypes = { ...types, ...custom.types }
    const joinedSubTypes = { ...subTypes, ...custom.subTypes }
    TYPE_CACHE = buildTypeCache(joinedTypes, joinedSubTypes)
  }

  get = () => TYPE_CACHE
  
  clear = () => {
    clearObj(TYPE_CACHE)
    TYPE_CACHE = {}
  }
  
  register = newType => {
    if(!validateNewType(newType, TYPE_CACHE))
      return null
  }

  getTypes = value => {
    TYPE_CACHE.mapTypes((name, meta) => {
      const { factory } = meta
      if(!factory || !factory.eval) return
      isValid = factory.eval(value)
    })
    
    // const rootType = isObj(value)
    //   ? TYPE_CACHE.map
    //   : Array.isArray(value)
    //     ? TYPE_CACHE.colletion
    //     : TYPE_CACHE[typeof value]
    
    // if(!rootType) rootType = TYPE_CACHE.string
    // if(!rootType.descendants)
    //   return rootType
    
  }

}

 
