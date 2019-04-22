export { default as cloneDeep } from 'lodash.clonedeep'

export const cloneJson = obj => JSON.parse(JSON.stringify(obj))

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

export const isObj = obj => typeof obj === 'object' && !Array.isArray(obj)

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


export const mapCb = (obj, cb) => (
  isObj(obj) && typeof cb === 'function' &&
  Object
    .entries(obj)
    .map(([ key, value ]) => cb(key, value))
)