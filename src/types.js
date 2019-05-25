import {
  clearTypeData,
  getMatchTypes,
  initTypeCache,
  isObj,
  loopSource,
  mapObj,
  validateBuildTypes,
  validateMatchType,
} from 'jTUtils'
import _unset from 'lodash.unset'
import { Values, Schema } from 'jTConstants'
import TypeDefs from './modules/types'
import StyleLoader from 'styleloader'

const styleLoader = new StyleLoader()
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

    get = name => (!name && TYPE_CACHE || (this.getFlat() || {})[name])
    
    getFlat = (startType, opts={}) => {
      if(FLAT_TYPES) return FLAT_TYPES

      const filter = Array.isArray(opts.filter) && opts.filter || []
      FLAT_TYPES = Object
        .entries((startType || TYPE_CACHE).children)
        .reduce((flatList, [ key, obj ]) => {
          if(filter.indexOf(key) !== -1) return flatList
            
          flatList[key] = obj
          if(obj.children)
            flatList = {
              ...flatList,
              ...this.getFlat(obj)
            }

          return flatList
        }, {})

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

    load = typesPath => {
      return TypeDefs.load(typesPath || Values.DEFAULT_TYPES)
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
      styleLoader.destroy()
    }

  }

  const typesCls = new Types()
  return typesCls.load(settings.typesPath)
    .then(loadedTypes => {
      settings.styleLoader = styleLoader
      TYPE_CACHE = initTypeCache(
        typesCls,
        settings,
        loadedTypes
      )

      return typesCls
    })
}
