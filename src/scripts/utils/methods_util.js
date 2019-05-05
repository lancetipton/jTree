import { Values } from '../constants'

let SHOW_LOGS
/**
 * Turns logs on || off
 * @param  { boolean } log - log values
 * @return { void }
 */
export const setLogs = log => (SHOW_LOGS = log)

/**
 * Logs a string to the inspector, uses the last argument to determine the log type
 * @param  { array } args - to be passed to the log call
 * @return { void }
 */
export const logData = (...args) => {
  let type = args.pop()
  if(!SHOW_LOGS && type !== 'error') return
  if(Values.LOG_TYPES.indexOf(type) === -1 ) type = 'dir'

  console[type](...args)
}

/**
 * Ensures a function is not called to many times
 * @param  { function } func - function to call
 * @param  { number } wait - how long to wait between function calls
 * @param  { boolean } immediate - should call immediately
 * @return { void }
 */
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

/**
 * Check if the passed in method is a function, and calls it
 * @param  { function } method - function to call
 * @param  { object } params - params to pass to the method on call
 * @return { any } - whatever the passed in method returns
 */
export const checkCall = (method, ...params) => 
  isFunc(method) && method(...params) || undefined

/**
 * Check if the passed in item is a function
 * @param  { any } test 
 * @return { boolean }
 */
export const isFunc = func => typeof func === 'function'

/**
 * Check if the passed in item is a Class or constructor function
 * @param  { any } test 
 * @return { boolean }
 */
export const isConstructor = test => {
  try { Reflect.construct(String, [],test) } 
  catch (e) { return false }

  return true
}

/**
 * Creates a uuid, unique up to around 20 million iterations. good enough for us
 * @param  { number } start of the uuid
 * @return { string } - build uuid
 */
export const uuid = a => a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,uuid)


export const noOp = () => {}