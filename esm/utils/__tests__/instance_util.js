"use strict";

var _constants = _interopRequireDefault(require("../../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var InstanceUtil = require('../instance_util.js');

var resetInstance = function resetInstance() {
  jest.resetAllMocks();
  InstanceUtil.clearInstanceCache();
};

describe('Instance Util', function () {
  beforeEach(function () {
    return resetInstance();
  });
  describe('buildInstancePos', function () {
    beforeEach(function () {
      return resetInstance();
    });
    it('should return a string based on the key an parent.pos', function () {
      var res = InstanceUtil.buildInstancePos('12345', {
        pos: 'parent'
      });
      expect(res).toEqual('parent.12345');
    });
    it('should return the key when key is equal to schema root', function () {
      var res = InstanceUtil.buildInstancePos(_constants.default.Schema.ROOT, {
        pos: 'parent'
      });
      expect(res).toEqual(_constants.default.Schema.ROOT);
    });
  });
  describe('clearInstanceCache', function () {
    beforeEach(function () {
      return resetInstance();
    });
    it('should set instance cache to undefined', function () {
      var testCache = {
        data: 'test'
      };
      InstanceUtil.setInstanceCache(testCache);
      expect(InstanceUtil.getInstanceCache()).toEqual(testCache);
      InstanceUtil.clearInstanceCache();
      expect(InstanceUtil.getInstanceCache()).toEqual(undefined);
    });
  });
  describe('getInstanceCache', function () {
    beforeEach(function () {
      return resetInstance();
    });
    it('should get entire INSTANCE_CACHE object when no id is passed in', function () {
      var testCache = {
        data: 'test'
      };
      InstanceUtil.setInstanceCache(testCache);
      expect(InstanceUtil.getInstanceCache()).toEqual(testCache);
    });
    it('should only get the cached item when a key is passed in', function () {
      var testCache = {
        data: 'test'
      };
      InstanceUtil.setInstanceCache(testCache);
      expect(InstanceUtil.getInstanceCache('data')).toEqual('test');
      expect(InstanceUtil.getInstanceCache('foo')).toEqual(undefined);
    });
  });
  describe('clearInstance', function () {
    it('should return false when no instance is found', function () {
      var testCache = {
        data: 'test'
      };
      InstanceUtil.setInstanceCache(testCache);
      expect(InstanceUtil.clearInstance('duper')).toEqual(false);
    });
    it('should return true if the instance is cleared', function () {
      var testCache = {
        data: {
          test: 'foo',
          "super": 'duper'
        }
      };
      InstanceUtil.setInstanceCache(testCache);
      expect(InstanceUtil.clearInstance('data')).toEqual(true);
    });
    it('should remove the istance from the INSTANCE_CACHE', function () {
      var testCache = {
        data: {
          test: 'foo',
          "super": 'duper'
        }
      };
      InstanceUtil.setInstanceCache(testCache);
      expect(InstanceUtil.getInstanceCache('data')).toEqual(undefined);
      expect(Object.keys(InstanceUtil.getInstanceCache()).length).toEqual(0);
    });
    it('should call componentWillUnmount when its a function on the instance', function () {
      var unmount = jest.fn();
      var testCache = {
        data: {
          componentWillUnmount: unmount
        }
      };
      InstanceUtil.setInstanceCache(testCache);
      InstanceUtil.clearInstance('data');
      expect(unmount).toHaveBeenCalled();
    });
    it('should remove all properties from the passed in instance', function () {
      var testCache = {
        data: {
          duper: 'foo',
          test: 'super'
        }
      };
      InstanceUtil.setInstanceCache(testCache);
      InstanceUtil.clearInstance('data');
      expect(Object.keys(testCache).length).toEqual(0);
    });
    it('should use the passed in instance, when no key is passed in', function () {
      var unmount = jest.fn();
      var testCache = {
        duper: 'foo',
        test: 'super',
        componentWillUnmount: unmount
      };
      InstanceUtil.clearInstance(false, testCache);
      expect(unmount).toHaveBeenCalled();
      expect(Object.keys(testCache).length).toEqual(0);
    });
  }); // describe('buildInstance', () => {
  // })
  // describe('addConstants.SchemaInstance', () => {
  // })
  // describe('addCompProp', () => {
  // })
});