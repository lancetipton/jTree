"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typesOverride = exports.buildTypeName = exports.buildTypeCache = exports.initTypeCache = void 0;

var _jsutils = require("jsutils");

var _validate_util = require("./validate_util");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var getTypeStyles = function getTypeStyles(settings, Type) {
  return Type && Type.hasOwnProperty('getStyles') && settings.styleLoader && settings.styleLoader.add && settings.styleLoader.add(buildStyleId(Type), Type.getStyles(settings));
};

var buildStyleId = function buildStyleId(Type) {
  Type.styleId = "".concat(Type.name.toLowerCase(), "-").concat((0, _jsutils.uuid)().split('-').pop());
  return Type.styleId;
};
/**
 * Builds the passed in types to be used with the Main TypeClass
 * @param { class instance } TypesCls - built TypeClass instance
 * @param { object } settings - settings passed into the jtree init method
 * 
 * @returns { object } - built Types to use in the editor
 */


var initTypeCache = function initTypeCache(TypesCls, settings) {
  var _ref = (0, _jsutils.get)(settings.types, 'definitions') || {},
      BaseType = _ref.BaseType,
      allTypes = _objectWithoutProperties(_ref, ["BaseType"]);

  if (!(0, _validate_util.validateMatchType)(BaseType)) return;
  TypesCls.BaseType = new BaseType((0, _jsutils.get)(settings.types, 'config.base') || {});
  return buildTypeCache(settings, _objectSpread({}, allTypes, {
    BaseType: TypesCls.BaseType
  }));
};

exports.initTypeCache = initTypeCache;

var getExtends = function getExtends(factory) {
  var parent = factory.__proto__ && (0, _jsutils.get)(factory.__proto__, 'prototype.constructor');
  return parent && {
    name: parent.name,
    base: parent,
    factory: parent.constructor
  };
};
/**
 * Formats the passed in types to be used in the jtree Editpr
 * @param { object } settings - settings passed into the jtree init method
 * @param { object } allTypes - types to be formatted
 * 
 * @returns { object } - formatted Types to use in the editor
 */


var buildTypeCache = function buildTypeCache(settings, types) {
  var BaseType = types.BaseType,
      allTypes = _objectWithoutProperties(types, ["BaseType"]);

  var BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor // Ensure the styles get loaded for the base

  };
  getTypeStyles(settings, BaseType.constructor);
  var builtTypes = Object.entries(allTypes).reduce(function (types, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        name = _ref3[0],
        factory = _ref3[1];

    var useName = buildTypeName(name);
    if (!(0, _validate_util.validateMatchType)(factory)) return allTypes;
    types[useName] = {
      name: useName,
      factory: factory,
      "extends": getExtends(factory, types) || BaseTypeMeta // Ensure the styles get loaded for each type factory

    };
    getTypeStyles(settings, factory);
    return types;
  }, {});
  Object.defineProperty(builtTypes, _constants.default.Values.MAP_TYPES, {
    value: function value(cb, parent) {
      return (0, _jsutils.mapObj)(parent, cb);
    },
    enumerable: false
  });
  return Object.freeze(builtTypes);
};
/**
 * Formats the type name to not include the word `Type`
 * @param { string } typeClsName - Name of the type class
 * 
 * @returns { string } - name without the word `Type`
 */


exports.buildTypeCache = buildTypeCache;

var buildTypeName = function buildTypeName(typeClsName) {
  return typeClsName.split('Type').join('').toLowerCase();
};
/**
 * Overrides a types default attribute with a custom one
 * attribute must be included in the TYPE_OVERWRITE constant
 * @param { class instance } typeInstance - created from a Type class
 * @param { object } config - passed in setting for this Type
 * 
 * @returns { void }
 */


exports.buildTypeName = buildTypeName;

var typesOverride = function typesOverride(typeInstance, config) {
  if (!config) return null;
  Object.entries(_constants.default.Values.TYPE_OVERWRITE).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        key = _ref5[0],
        type = _ref5[1];

    return _typeof(config[key]) === type && typeInstance[key] !== config[key] && (typeInstance[key] = config[key]);
  });
};

exports.typesOverride = typesOverride;