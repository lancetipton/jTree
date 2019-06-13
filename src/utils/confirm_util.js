import  { isFunc, isStr } from 'jsutils'

let CONFIRM_ACTION
let CUSTOM_CONFIRM

/**
 * Sets a confirm method, and or enables confirm on change
 * @param { function || boolean } confirmAct - enable confirm, and set custom function
 */
export const setConfirm = confirmAct => {
  isFunc(confirmAct) && (CUSTOM_CONFIRM = confirmAct)
  if(confirmAct) CONFIRM_ACTION = true
  else {
    CUSTOM_CONFIRM = undefined
    CONFIRM_ACTION = undefined
  }
}

/**
 * Calls the custom confirm method or default window confirm when confirm is enabled
 * @param {*} data
 * @param {*} message
 * 
 * @returns { boolean }
 */
export const checkConfirm = (...params) => {
  if(!CONFIRM_ACTION) return true
  const message = params.pop()
  if(!isStr(message)) return true

  const outcome = isFunc(CUSTOM_CONFIRM)
    ? CUSTOM_CONFIRM(...params)
    : window.confirm(message)
  
  return Boolean(outcome)
}

const isTest = process.env.NODE_ENV === 'test'
isTest && (module.exports.getConfirmAction = () => CONFIRM_ACTION)
isTest && (module.exports.getCustomConfirm = () => CUSTOM_CONFIRM)
  