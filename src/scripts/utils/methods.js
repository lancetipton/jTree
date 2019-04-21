import { LOG_TYPES } from '../constants'

let SHOW_LOGS
export const setLogs = log => (SHOW_LOGS = log)
export const logData = (...args) => {
  let type = args.pop()
  if(!SHOW_LOGS && type !== 'error') return
  if(LOG_TYPES.indexOf(type) === -1 ) type = 'dir'

  console[type](...args)
}

/**
 * Deep merges an array of objects together
 * @param { array } sources - array of objects to join
 * @returns
 */
export const deepMerge = (...sources) => (
  sources.reduce(
    (merged, source) =>
      source instanceof Array
        ? // Check if it's array, and join the arrays
        [ ...((merged instanceof Array && merged) || []), ...source ]
        : // Check if it's an object, and loop the properties
        source instanceof Object
          ? Object.entries(source)
            // Loop the entries of the object, and add them to the merged object
            .reduce(
              (joined, [ key, value ]) => ({
                ...joined,
                [key]:
                  // Check if the value is an object, and deep merge the object with the current merged object
                  (value instanceof Object &&
                    key in joined &&
                    deepMerge(joined[key], value)) ||
                  // Otherwise just set the value
                  value
              }),
              merged
            )
          : // If it's not an array or object, just return the merge object
          merged,
    {}
  )
)
  
  
export const debounce = (func, wait = 250, immediate = false) => {
  let timeout
  return (...args) => {
    if(typeof func !== 'function') return null

    let context = this
    let later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    let callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      return typeof func === 'function' && func.apply(context, args)
    }
  }
}

export const checkCall = (method, ...params) => {
  if (typeof method === 'function')
    return method(...params)
}

export const isObj = obj => typeof obj === 'object' && !Array.isArray(obj)

export const isFunc = func => typeof func === 'function'

export const parseJSONString = str => {
  try {
    return JSON.parse(str)
  }
  catch(e){
    return e.message
  }
}

export const jsonCopy = obj => JSON.parse(JSON.strigify(obj))

export const clearObj = obj => (
  Object
    .entries(obj)
    .map(([key, value]) => {
      if(typeof value === 'object')
        clearObj(value)

      obj[key] = undefined
      delete obj[key]
    })
)

export const isConstructor = test => {
  try { Reflect.construct(String, [], f) } 
  catch (e) { return false }

  return true
}

/**
 * Creates a uuid, unique up to around 20 million iterations. good enough for us
 * @param  { number } start of the uuid
 * @return { string } - build uuid
 */
export const uuid = a => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,uuid)


export const mapCb = (obj, cb) => (
  isObj(obj) && typeof cb === 'function' &&
  Object
    .entries(obj)
    .map(([ key, value ]) => cb(key, value))
)