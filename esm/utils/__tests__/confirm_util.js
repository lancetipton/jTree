"use strict";

var Confirm = require('../confirm_util.js');

var resetConfirm = function resetConfirm() {
  jest.resetAllMocks();
  Confirm.setConfirm(false);
  window.confirm = jest.fn(function (data) {
    return data;
  });
};

describe('Confirm Util', function () {
  beforeEach(function () {
    return resetConfirm();
  });
  describe('setConfirm', function () {
    beforeEach(function () {
      return resetConfirm();
    });
    it('should set CONFIRM_ACTION to true when called with a truthy param', function () {
      Confirm.setConfirm(true);
      expect(Confirm.getConfirmAction()).toEqual(true);
      Confirm.setConfirm(false);
      Confirm.setConfirm({});
      expect(Confirm.getConfirmAction()).toEqual(true);
    });
    it('should set CONFIRM_ACTION to undefined when called with a falsy param', function () {
      Confirm.setConfirm(false);
      expect(Confirm.getConfirmAction()).toEqual(undefined);
      Confirm.setConfirm(true);
      Confirm.setConfirm(0);
      expect(Confirm.getConfirmAction()).toEqual(undefined);
    });
    it('should set CUSTOM_CONFIRM to the passed in method and CONFIRM_ACTION true', function () {
      var customMeth = function customMeth() {};

      Confirm.setConfirm(customMeth);
      expect(Confirm.getCustomConfirm()).toEqual(customMeth);
      expect(Confirm.getConfirmAction()).toEqual(true);
    });
    it('should set CUSTOM_CONFIRM to undefined when passed a falsy value', function () {
      Confirm.setConfirm(false);
      expect(Confirm.getCustomConfirm()).toEqual(undefined);
    });
  });
  describe('checkConfirm', function () {
    beforeEach(function () {
      return resetConfirm();
    });
    it('should return true when CONFIRM_ACTION is falsy', function () {
      expect(Confirm.getCustomConfirm() != true).toEqual(true);
      expect(Confirm.checkConfirm()).toEqual(true);
    });
    it('should call CUSTOM_CONFIRM method when exists, and return a boolean', function () {
      var customMeth = jest.fn(function (data) {
        return 'duper';
      });
      Confirm.setConfirm(customMeth);
      var res = Confirm.checkConfirm({}, 'I am message');
      expect(res).toEqual(true);
      expect(customMeth).toHaveBeenCalled();
    });
    it('should return a boolean based on response from custom method', function () {
      var customMeth = jest.fn(function (data) {
        return 0;
      });
      Confirm.setConfirm(customMeth);
      var res = Confirm.checkConfirm({}, 'I am message');
      expect(res).toEqual(false);
      expect(customMeth).toHaveBeenCalled();
    });
    it('should call window.confirm when CUSTOM_CONFIRM is not a function', function () {
      Confirm.setConfirm(true);
      var res = Confirm.checkConfirm({}, 'I am message');
      expect(window.confirm).toHaveBeenCalled();
    });
    it('should return a boolean based on response from window.confirm', function () {
      Confirm.setConfirm(true);
      var res = Confirm.checkConfirm('I am message');
      var res2 = Confirm.checkConfirm('');
      expect(res).toEqual(true);
      expect(res2).toEqual(false);
      expect(window.confirm).toHaveBeenCalledTimes(2);
    });
    it('should return true if no params are passed in', function () {
      Confirm.setConfirm(true);
      var res = Confirm.checkConfirm();
      expect(res).toEqual(true);
    });
  });
});