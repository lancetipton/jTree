"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypesCls = TypesCls;
exports.buildTypes = void 0;

var _jTUtils = require("jTUtils");

var _jsutils = require("jsutils");

var _lodash = _interopRequireDefault(require("lodash.unset"));

var _constants = _interopRequireDefault(require("./constants"));

var _styleloader = _interopRequireDefault(require("styleloader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var STYLE_LOADER;
var TYPE_CACHE;
var FLAT_TYPES;

var buildTypes = function buildTypes(source, settings, elementCb) {
  var _tree;

  if (!(0, _jTUtils.validateBuildTypes)(source, settings.Editor)) return null;
  var tree = (_tree = {
    schema: {}
  }, _defineProperty(_tree, _constants.default.Schema.ROOT, source), _defineProperty(_tree, "idMap", {}), _tree);
  var rootSchema = {
    value: source,
    key: _constants.default.Schema.ROOT
  };
  return (0, _jTUtils.loopSource)(rootSchema, tree, settings, elementCb);
};

exports.buildTypes = buildTypes;

function TypesCls(settings) {
  var Types = function Types() {
    var _this = this;

    _classCallCheck(this, Types);

    _defineProperty(this, "get", function (name) {
      return !name && TYPE_CACHE || TYPE_CACHE[name];
    });

    _defineProperty(this, "clear", function () {
      var includeClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      (0, _jTUtils.clearTypeData)(_this, TYPE_CACHE, includeClass);
      TYPE_CACHE = undefined;
      (0, _jsutils.mapObj)(FLAT_TYPES, function (key) {
        return (0, _lodash.default)(FLAT_TYPES[key]);
      });
      FLAT_TYPES = undefined;
    });

    _defineProperty(this, "register", function (newType) {
      if (!(0, _jTUtils.validateMatchType)(newType, TYPE_CACHE)) return null;
    });

    _defineProperty(this, "rebuild", function () {
      _this.clear(false);

      TYPE_CACHE = (0, _jTUtils.initTypeCache)(_this, settings);
    });

    _defineProperty(this, "getValueTypes", function (value) {
      var matchTypes = _jTUtils.getMatchTypes.apply(_this, [TYPE_CACHE, value, TYPE_CACHE, settings, {}]);

      if (matchTypes.highest && matchTypes[matchTypes.highest]) return matchTypes[matchTypes.highest];
      var firstKey = (0, _jsutils.isObj)(matchTypes) && Object.keys(matchTypes)[0];
      return firstKey && matchTypes[firstKey];
    });

    _defineProperty(this, "destroy", function (Editor) {
      _this.clear();

      STYLE_LOADER.destroy();
    });

    if (!settings.types || !settings.types.definitions) return (0, _jsutils.logData)("No types found as 'settings.types.definitions'", 'error');
    STYLE_LOADER = new _styleloader.default();
    settings.styleLoader = STYLE_LOADER;
    TYPE_CACHE = (0, _jTUtils.initTypeCache)(this, settings);
  };

  return new Types();
}