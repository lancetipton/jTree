import {
  buildFlatTypes,
  clearTypeData,
  getMatchTypes,
  initTypeCache,
  loopSource,
  validateBuildTypes,
  validateMatchType,
} from 'jTUtils'
import { logData, isObj, mapObj } from 'jsUtils'
import _unset from 'lodash.unset'
import { Schema } from 'jTConstants'
import StyleLoader from 'styleloader'

let STYLE_LOADER
let TYPE_CACHE
let FLAT_TYPES

export const buildTypes = (source, settings, elementCb) => {
  if(!validateBuildTypes(source, settings.Editor)) return null
  const tree = { schema: {}, [Schema.ROOT]: source, idMap: {} }
  const rootSchema = { value: source, key: Schema.ROOT }

  return loopSource(rootSchema, tree, settings, elementCb)
}

export function TypesCls(settings){
  
  class Types {

    constructor(){
      if(!settings.types || !settings.types.definitions)
        return logData(`No types found as 'settings.types.definitions'`, 'error')

      STYLE_LOADER = new StyleLoader()

      settings.styleLoader = STYLE_LOADER
      TYPE_CACHE = initTypeCache(this, settings)
    }

    get = name => (!name && TYPE_CACHE || (this.getFlat() || {})[name])
    
    getFlat = (startType, opts={}) => {
      if(!FLAT_TYPES) 
        FLAT_TYPES = buildFlatTypes(startType || TYPE_CACHE, opts)

      return FLAT_TYPES
    }
    
    clear = (includeClass=true) => {
      clearTypeData(this, TYPE_CACHE, includeClass)
      TYPE_CACHE = undefined

      mapObj(FLAT_TYPES, key => _unset(FLAT_TYPES[key]))
      FLAT_TYPES = undefined
    }
    
    register = newType => {
      if(!validateMatchType(newType, TYPE_CACHE))
        return null
    }

    rebuild = () => {
      this.clear(false)
      TYPE_CACHE = initTypeCache(this, settings)
    }
    
    getValueTypes = value => {
      const matchTypes = getMatchTypes.apply(
        this, 
        [
          TYPE_CACHE,
          value,
          TYPE_CACHE.children,
          settings,
          {}
        ]
      )

      if(matchTypes.highest && matchTypes[matchTypes.highest])
        return matchTypes[matchTypes.highest]

      const firstKey =  isObj(matchTypes) && Object.keys(matchTypes)[0]
      return firstKey && matchTypes[firstKey]
    }
    
    destroy = (Editor) => {
      this.clear()
      STYLE_LOADER.destroy()
    }

  }


  return new Types()
}
