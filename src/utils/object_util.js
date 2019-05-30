import _unset from 'lodash.unset'
import { isObj } from 'jsUtils'
export { default as cloneDeep } from 'lodash.clonedeep'


export const addProp = (obj, name, def) => (
  isObj(obj) && Object.defineProperty(obj, name, def)
)

export const deepClone = (obj, hash = new WeakMap()) => {
  if (Object(obj) !== obj) return obj
  if (obj instanceof Set) return new Set(obj)
  if (hash.has(obj)) return hash.get(obj)

  const result = obj instanceof Date 
    ? new Date(obj)
    : obj instanceof RegExp 
      ? new RegExp(obj.source, obj.flags)
      : obj.constructor 
        ? new obj.constructor() 
        : Object.create(null)

  hash.set(obj, result)
  if (obj instanceof Map)
      Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)) )

  return Object
    .assign(
      result,
      ...Object.keys(obj)
        .map(key => ({ [key]: deepClone(obj[key], hash) }))
    )
}

export const isConstructor = obj => {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}