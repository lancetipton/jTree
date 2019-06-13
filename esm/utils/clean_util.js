"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanUp = exports.clearTypeData = exports.clearSchema = void 0;

var _jsutils = require("jsutils");

var _instance_util = require("./instance_util");

var _lodash = _interopRequireDefault(require("lodash.unset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cleanSettingsObj = function cleanSettingsObj(settings) {
  (0, _jsutils.clearObj)(settings.Editor.config);
  (0, _jsutils.clearObj)(settings);
};

var clearTypeCache = function clearTypeCache(typeCache) {
  return (0, _jsutils.isObj)(typeCache) && Object.keys(typeCache).map(function (key) {
    switch (key) {
      case 'children':
        Object.values(typeCache).map(function (child) {
          return clearTypeCache(child);
        });
        break;

      case 'extends':
        Object.keys(typeCache.extends).map(function (key) {
          return (0, _lodash.default)(typeCache.extends, key);
        });
        break;
    }

    (0, _lodash.default)(typeCache, key);
  }).length || (typeCache = undefined);
};

var cleanTreeSchema = function cleanTreeSchema(tree) {
  return Object.keys(tree.schema).map(function (key) {
    return tree.schema[key] && (clearSchema(tree.schema[key], tree) || (tree.schema[key] = undefined));
  });
};

var clearSchema = function clearSchema(schema, tree) {
  var removeInstance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (!schema || !schema.pos || !tree.schema || !tree.schema[schema.pos]) return;

  if (tree.schema && tree.schema[schema.pos] !== schema) {
    return (0, _jsutils.logData)("Can not clear schema from tree. tree.schema and schema do not match", 'warn');
  }

  var schemaPos = schema.pos; // Remove built instance
  // Sometimes the instance is re-used, so check before removing. I.E. replace

  removeInstance && (0, _instance_util.clearInstance)(schema.id); // Remove ref in the tree idMap

  (0, _lodash.default)(tree.idMap, schema.id); // Remove all references to clear out potential memory leaks

  (0, _lodash.default)(schema, 'domNode');
  (0, _lodash.default)(schema, 'parent');
  (0, _lodash.default)(schema, 'instance');
  (0, _lodash.default)(schema, 'value'); // Remove the schema from the tree of schemas

  (0, _lodash.default)(tree.schema, schema.pos);
  (0, _jsutils.clearObj)(schema); // Loop over the tree schema and clear out any child schemas to the current schema
  // tree.idMap will also be cleared out for each cleared schema

  (0, _jsutils.mapObj)(tree.schema, function (pos, schemaItem) {
    pos.indexOf(schemaPos) === 0 && clearSchema(schemaItem, tree);
  });
};

exports.clearSchema = clearSchema;

var clearTypeData = function clearTypeData(TypeCls, typeCache) {
  var includeClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  clearTypeCache(typeCache);
  (0, _lodash.default)(TypeCls, 'BaseType');
  includeClass && (0, _jsutils.clearObj)(TypeCls);
};

exports.clearTypeData = clearTypeData;

var cleanUp = function cleanUp(settings, tree) {
  tree.schema && cleanTreeSchema(tree);
  (0, _instance_util.clearInstanceCache)();
  cleanSettingsObj(settings);
};

exports.cleanUp = cleanUp;