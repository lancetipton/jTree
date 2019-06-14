"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypesCls = TypesCls;
exports.buildTypes = void 0;

var _utils = require("./utils");

var _jsutils = require("jsutils");

var _constants = _interopRequireDefault(require("./constants"));

var _styleloader = _interopRequireDefault(require("styleloader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let STYLE_LOADER;
let TYPE_CACHE;
let FLAT_TYPES;

const buildTypes = (source, settings, elementCb) => {
  if (!(0, _utils.validateBuildTypes)(source, settings.Editor)) return null;
  const tree = {
    schema: {},
    [_constants.default.Schema.ROOT]: source,
    idMap: {}
  };
  const rootSchema = {
    value: source,
    key: _constants.default.Schema.ROOT
  };
  return (0, _utils.loopSource)(rootSchema, tree, settings, elementCb);
};

exports.buildTypes = buildTypes;

function TypesCls(settings) {
  class Types {
    constructor() {
      _defineProperty(this, "get", name => !name && TYPE_CACHE || TYPE_CACHE[name]);

      _defineProperty(this, "clear", (includeClass = true) => {
        (0, _utils.clearTypeData)(this, TYPE_CACHE, includeClass);
        TYPE_CACHE = undefined;
        (0, _jsutils.mapObj)(FLAT_TYPES, key => (0, _jsutils.unset)(FLAT_TYPES[key]));
        FLAT_TYPES = undefined;
      });

      _defineProperty(this, "register", newType => {
        if (!(0, _utils.validateMatchType)(newType, TYPE_CACHE)) return null;
      });

      _defineProperty(this, "rebuild", () => {
        this.clear(false);
        TYPE_CACHE = (0, _utils.initTypeCache)(this, settings);
      });

      _defineProperty(this, "getValueTypes", value => {
        const matchTypes = _utils.getMatchTypes.apply(this, [TYPE_CACHE, value, TYPE_CACHE, settings, {}]);

        if (matchTypes.highest && matchTypes[matchTypes.highest]) return matchTypes[matchTypes.highest];
        const firstKey = (0, _jsutils.isObj)(matchTypes) && Object.keys(matchTypes)[0];
        return firstKey && matchTypes[firstKey];
      });

      _defineProperty(this, "destroy", Editor => {
        this.clear();
        STYLE_LOADER.destroy();
      });

      if (!settings.types || !settings.types.definitions) return (0, _jsutils.logData)(`No types found as 'settings.types.definitions'`, 'error');
      STYLE_LOADER = new _styleloader.default();
      settings.styleLoader = STYLE_LOADER;
      TYPE_CACHE = (0, _utils.initTypeCache)(this, settings);
    }

  }

  return new Types();
}