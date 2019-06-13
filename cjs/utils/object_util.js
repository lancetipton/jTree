"use strict";

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.map");

require("core-js/modules/es.regexp.constructor");

require("core-js/modules/es.set");

require("core-js/modules/es.weak-map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "cloneDeep", {
  enumerable: true,
  get: function get() {
    return _lodash2.default;
  }
});
exports.isConstructor = exports.deepClone = exports.addProp = void 0;

var _lodash = _interopRequireDefault(require("lodash.unset"));

var _jsutils = require("jsutils");

var _lodash2 = _interopRequireDefault(require("lodash.clonedeep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const addProp = (obj, name, def) => (0, _jsutils.isObj)(obj) && Object.defineProperty(obj, name, def);

exports.addProp = addProp;

const deepClone = (obj, hash = new WeakMap()) => {
  if (Object(obj) !== obj) return obj;
  if (obj instanceof Set) return new Set(obj);
  if (hash.has(obj)) return hash.get(obj);
  const result = obj instanceof Date ? new Date(obj) : obj instanceof RegExp ? new RegExp(obj.source, obj.flags) : obj.constructor ? new obj.constructor() : Object.create(null);
  hash.set(obj, result);
  if (obj instanceof Map) Array.from(obj, ([key, val]) => result.set(key, deepClone(val, hash)));
  return _extends(result, ...Object.keys(obj).map(key => ({
    [key]: deepClone(obj[key], hash)
  })));
};

exports.deepClone = deepClone;

const isConstructor = obj => {
  return !!obj.prototype && !!obj.prototype.constructor.name;
};

exports.isConstructor = isConstructor;