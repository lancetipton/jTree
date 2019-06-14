"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "cloneDeep", {
  enumerable: true,
  get: function get() {
    return _lodash.default;
  }
});
exports.isConstructor = exports.addProp = void 0;

var _jsutils = require("jsutils");

var _lodash = _interopRequireDefault(require("lodash.clonedeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var addProp = function addProp(obj, name, def) {
  return (0, _jsutils.isObj)(obj) && Object.defineProperty(obj, name, def);
};

exports.addProp = addProp;

var isConstructor = function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
};

exports.isConstructor = isConstructor;