"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typesOverride = exports.buildTypeName = exports.buildTypeCache = exports.initTypeCache = void 0;

var _jsutils = require("jsutils");

var _validate_util = require("./validate_util");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const getTypeStyles = (settings, Type) => Type && Type.hasOwnProperty('getStyles') && settings.styleLoader && settings.styleLoader.add && settings.styleLoader.add(buildStyleId(Type), Type.getStyles(settings));

const buildStyleId = Type => {
  Type.styleId = `${Type.name.toLowerCase()}-${(0, _jsutils.uuid)().split('-').pop()}`;
  return Type.styleId;
};
/**
 * Builds the passed in types to be used with the Main TypeClass
 * @param { class instance } TypesCls - built TypeClass instance
 * @param { object } settings - settings passed into the jtree init method
 * 
 * @returns { object } - built Types to use in the editor
 */


const initTypeCache = (TypesCls, settings) => {
  const _ref = (0, _jsutils.get)(settings.types, 'definitions') || {},
        BaseType = _ref.BaseType,
        allTypes = _objectWithoutProperties(_ref, ["BaseType"]);

  if (!(0, _validate_util.validateMatchType)(BaseType)) return;
  TypesCls.BaseType = new BaseType((0, _jsutils.get)(settings.types, 'config.base') || {});
  return buildTypeCache(settings, _objectSpread({}, allTypes, {
    BaseType: TypesCls.BaseType
  }));
};

exports.initTypeCache = initTypeCache;

const getExtends = factory => {
  const parent = factory.__proto__ && (0, _jsutils.get)(factory.__proto__, 'prototype.constructor');
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


const buildTypeCache = (settings, types) => {
  const BaseType = types.BaseType,
        allTypes = _objectWithoutProperties(types, ["BaseType"]);

  const BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor // Ensure the styles get loaded for the base

  };
  getTypeStyles(settings, BaseType.constructor);
  const builtTypes = Object.entries(allTypes).reduce((types, [name, factory]) => {
    const useName = buildTypeName(name);
    if (!(0, _validate_util.validateMatchType)(factory)) return allTypes;
    types[useName] = {
      name: useName,
      factory,
      "extends": getExtends(factory, types) || BaseTypeMeta // Ensure the styles get loaded for each type factory

    };
    getTypeStyles(settings, factory);
    return types;
  }, {});
  Object.defineProperty(builtTypes, _constants.default.Values.MAP_TYPES, {
    value: (cb, parent) => (0, _jsutils.mapObj)(parent, cb),
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

const buildTypeName = typeClsName => typeClsName.split('Type').join('').toLowerCase();
/**
 * Overrides a types default attribute with a custom one
 * attribute must be included in the TYPE_OVERWRITE constant
 * @param { class instance } typeInstance - created from a Type class
 * @param { object } config - passed in setting for this Type
 * 
 * @returns { void }
 */


exports.buildTypeName = buildTypeName;

const typesOverride = (typeInstance, config) => {
  if (!config) return null;
  Object.entries(_constants.default.Values.TYPE_OVERWRITE).map(([key, type]) => typeof config[key] === type && typeInstance[key] !== config[key] && (typeInstance[key] = config[key]));
};

exports.typesOverride = typesOverride;