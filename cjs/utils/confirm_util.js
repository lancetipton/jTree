"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkConfirm = exports.setConfirm = void 0;

var _jsutils = require("jsutils");

let CONFIRM_ACTION;
let CUSTOM_CONFIRM;
/**
 * Sets a confirm method, and or enables confirm on change
 * @param { function || boolean } confirmAct - enable confirm, and set custom function
 */

const setConfirm = confirmAct => {
  (0, _jsutils.isFunc)(confirmAct) && (CUSTOM_CONFIRM = confirmAct);
  if (confirmAct) CONFIRM_ACTION = true;else {
    CUSTOM_CONFIRM = undefined;
    CONFIRM_ACTION = undefined;
  }
};
/**
 * Calls the custom confirm method or default window confirm when confirm is enabled
 * @param {*} data
 * @param {*} message
 * 
 * @returns { boolean }
 */


exports.setConfirm = setConfirm;

const checkConfirm = (...params) => {
  if (!CONFIRM_ACTION) return true;
  const message = params.pop();
  if (!(0, _jsutils.isStr)(message)) return true;
  const outcome = (0, _jsutils.isFunc)(CUSTOM_CONFIRM) ? CUSTOM_CONFIRM(...params) : window.confirm(message);
  return Boolean(outcome);
};

exports.checkConfirm = checkConfirm;
const isTest = process.env.NODE_ENV === 'test';
isTest && (module.exports.getConfirmAction = () => CONFIRM_ACTION);
isTest && (module.exports.getCustomConfirm = () => CUSTOM_CONFIRM);