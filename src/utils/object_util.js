import { isObj, deepClone } from 'jsutils'

export const addProp = (obj, name, def) => (
  isObj(obj) && Object.defineProperty(obj, name, def)
)

export const isConstructor = obj => {
  return !!obj.prototype && !!obj.prototype.constructor.name;
}
