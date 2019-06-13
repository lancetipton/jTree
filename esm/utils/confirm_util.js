"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkConfirm = exports.setConfirm = void 0;

var _jsutils = require("jsutils");

var CONFIRM_ACTION;
var CUSTOM_CONFIRM;
/**
 * Sets a confirm method, and or enables confirm on change
 * @param { function || boolean } confirmAct - enable confirm, and set custom function
 */

var setConfirm = function setConfirm(confirmAct) {
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

var checkConfirm = function checkConfirm() {
  if (!CONFIRM_ACTION) return true;

  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  var message = params.pop();
  if (!(0, _jsutils.isStr)(message)) return true;
  var outcome = (0, _jsutils.isFunc)(CUSTOM_CONFIRM) ? CUSTOM_CONFIRM.apply(void 0, params) : window.confirm(message);
  return Boolean(outcome);
};

exports.checkConfirm = checkConfirm;
var isTest = process.env.NODE_ENV === 'test';
isTest && (module.exports.getConfirmAction = function () {
  return CONFIRM_ACTION;
});
isTest && (module.exports.getCustomConfirm = function () {
  return CUSTOM_CONFIRM;
});