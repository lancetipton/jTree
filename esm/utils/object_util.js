"use strict";

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var addProp = function addProp(obj, name, def) {
  return (0, _jsutils.isObj)(obj) && Object.defineProperty(obj, name, def);
};

exports.addProp = addProp;

var deepClone = function deepClone(obj) {
  var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new WeakMap();
  if (Object(obj) !== obj) return obj;
  if (obj instanceof Set) return new Set(obj);
  if (hash.has(obj)) return hash.get(obj);
  var result = obj instanceof Date ? new Date(obj) : obj instanceof RegExp ? new RegExp(obj.source, obj.flags) : obj.constructor ? new obj.constructor() : Object.create(null);
  hash.set(obj, result);
  if (obj instanceof Map) Array.from(obj, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    return result.set(key, deepClone(val, hash));
  });
  return _extends.apply(void 0, [result].concat(_toConsumableArray(Object.keys(obj).map(function (key) {
    return _defineProperty({}, key, deepClone(obj[key], hash));
  }))));
};

exports.deepClone = deepClone;

var isConstructor = function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
};

exports.isConstructor = isConstructor;