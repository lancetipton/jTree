"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRemoveSchema = exports.addChildSchema = exports.updateSchemaProp = exports.updateKey = exports.updateValue = exports.updateType = exports.updateSchema = exports.updateSchemaError = void 0;

var _jsutils = require("jsutils");

var _clean_util = require("./clean_util");

var _instance_util = require("./instance_util");

var _constants = _interopRequireDefault(require("../constants"));

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.set"));

var _lodash3 = _interopRequireDefault(require("lodash.unset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Checks if the schemas current value matches any allowed types for the new type
 * The newType must have a static prop allowEmptyValue
 * Which can be any of
 *       * Array - [ check if the value matches any values in the array ]
 *       * Object - [ check if the value is an empty object ]
 *       * true - [ match the value to empty object || array || string || 0 ]
 * @param  {any} newType - Object built by the types util ( requires newType.factory )
 * @param  {any} schema - Current schema of the item being checked
 * @return boolean of if the value is an equal value for the type
 */
var checkEmptyType = function checkEmptyType(newType, schema) {
  var allowEmptyValue = newType.factory.allowEmptyValue;
  if (allowEmptyValue === undefined) return false; // If exact match, just return true

  if (schema.value === allowEmptyValue) return true;
  var valIsObj = _typeof(schema.value) === 'object';
  var valIsEmptyObj = valIsObj && Object.keys(schema.value).length === 0; // Check allow empty is true
  // Then check the types, and use that to check if it's empty

  if (allowEmptyValue === true) return valIsObj ? valIsEmptyObj : schema.value === 0 || schema.value === ''; // Cache so vars for easy lookup

  var allowType = _typeof(allowEmptyValue);

  var allowIsObj = allowType === 'object';
  var allowArr = allowIsObj && Array.isArray(allowEmptyValue); // If the type if an array, then loop over the array, and see if any match 
  // the current value

  if (allowArr) return allowEmptyValue.reduce(function (hasEmpty, allowedEmpty) {
    return hasEmpty ? hasEmpty : allowIsObj && valIsEmptyObj || schema.value === allowedEmpty;
  }); // If it's an object, but not array

  return allowIsObj && _typeof(valIsEmptyObj);
};
/**
 * Builds a new pos, by switching the pos for the key
 * Only works at a single level
 * @param  { string } pos - current tree node position
 * @param  { string } key - new tree node position
 * @return { string } updated tree node position
 */


var buildNewPos = function buildNewPos(pos, key) {
  var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var splitPos = pos.split('.');
  replace ? splitPos[splitPos.length - 1] = key : splitPos.push(key);
  return splitPos.join('.');
};
/**
 * Checks if the passed in pos already exists in the tree
 * @param  { object } tree - object containing the entire jtree object structure 
 * @param  { string } pos - location in the tree to check
 */


var checkSchemaPos = function checkSchemaPos(tree, pos, checkExists) {
  return checkExists ? !tree.schema[pos] ? (0, _jsutils.logData)("Cannot update schema in tree. Schema does not exist!", pos, tree.schema[pos], 'error') : true : tree.schema[pos] ? (0, _jsutils.logData)("Cannot add child to tree. Schema pos already exists!", pos, tree.schema[pos], 'error') : true;
};
/**
 * Updates the error field on a schema
 * @param  { object } tree - object containing the entire jtree object structure 
 * @param  { object } schema - current schema being updated
 * @param { object } settings - current settings of the Editor
 * @param { string } prop - prop on the schema where the error occured
 * @param { any } value - current value of the schema
 * @param { string } message - Error message
 * 
 * @return { void }
 */


var updateSchemaError = function updateSchemaError(tree, schema, settings, prop, value, message) {
  schema.error = (0, _jsutils.checkCall)(schema.instance.constructor.error, {
    prop: prop,
    value: value,
    message: message,
    schema: schema,
    tree: tree,
    settings: settings
  });
};
/**
 * Updates the schema with the passed in update object
 * @param  { object } update - object containing updates to the schema
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */


exports.updateSchemaError = updateSchemaError;

var updateSchema = function updateSchema(update, schema) {
  return (0, _jsutils.isObj)(update) && (0, _jsutils.isObj)(schema) && Object.entries(update).reduce(function (updated, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    if (key === 'type') key = 'matchType';
    updated[key] = value;
    return updated;
  }, schema);
};
/**
 * Updates the matchType of the tree node at the passed in pos
 * @param  { object } tree - object containing the entire jtree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */


exports.updateSchema = updateSchema;

var updateType = function updateType(tree, pos, schema, settings) {
  if (!pos || !(0, _jsutils.isObj)(schema)) return {
    error: "The pos and schema are required to update schema type" // Ensure the passed in pos exists in the tree

  };
  if (!checkSchemaPos(tree, pos, true)) return; // Remove the old instance

  (0, _instance_util.clearInstance)(schema.id);
  (0, _lodash3.default)(schema, 'instance'); // Get the type to switch to

  var newType = settings.Editor.Types.get(schema.matchType);
  if (!newType) return {
    error: "Type '".concat(schema.matchType, "' in not a configured type")
  };
  var hasValue = schema.value || schema.value === 0 || schema.value === '';
  if (!hasValue && (0, _jsutils.isFunc)(newType.factory.defaultValue)) schema.value = newType.factory.defaultValue(schema, settings); // Check if it has a value

  hasValue = schema.value || schema.value === 0 || schema.value === ''; // Check if the value is an empty type

  var hasEmpty = checkEmptyType(newType, schema); // If we have a value and it's not an empty type, then run an eval check on it
  // If it fails, set the error on the schema. The Types determine how to handel it

  if (hasValue && !hasEmpty && !newType.factory.eval(schema.value)) return {
    error: "'Not a valid value for ".concat((newType.factory.name || '').replace('Type', '')) // If there's a value, and no error, then set it in the tree

  };
  if (hasValue && !schema.error) (0, _lodash2.default)(tree, schema.pos, schema.value);
  tree.schema[pos] = _objectSpread({}, schema, {
    pending: true,
    instance: (0, _instance_util.buildInstance)(newType, schema, settings),
    mode: _constants.default.Schema.MODES.EDIT
  });
};
/**
 * Updates the value of the tree node at the passed in pos
 * @param  { object } tree - object containing the entire jtree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */


exports.updateType = updateType;

var updateValue = function updateValue(tree, pos, schema, settings) {
  // Get ref to the constructor from the tree, it does not exist in the 
  // current schema copy
  var factory = tree.schema[pos].instance.constructor;
  if ('value' in schema && !factory.eval(schema.value)) return {
    error: "Not a valid value for ".concat((factory.name || '').replace('Type', ''))
  };
  (0, _lodash2.default)(tree, pos, schema.value);
  (0, _lodash2.default)(tree.schema[pos], 'value', schema.value);
};
/**
 * Updates the position of an node in the tree
 * Updates the global tree object with the new position and schema
 * @param  { object } tree - object containing the entire jtree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { string } - updated position based on the new key
 */


exports.updateValue = updateValue;

var updateKey = function updateKey(tree, pos, schema, settings) {
  if (!schema.key) return {
    error: "Can not set key to a falsy value!" // Cache the current value at that pos

  };
  var currentVal = (0, _lodash.default)(tree, pos); // Get the new pos based on the update key and old pos

  var updatedPos = buildNewPos(pos, schema.key); // If the key was not actually changed, just return

  if (updatedPos === pos) return; // Check if the updatedPos already exists. If it does, just return
  // Cause we don't want to overwrite it

  if (tree.schema[updatedPos]) return {
    error: "Can not update key ".concat(schema.key, ", because it already exists!") // Remove the old value in the tree

  };
  var unsetContent = (0, _lodash3.default)(tree, pos);
  if (!unsetContent) return {
    error: "Could not update key, because ".concat(pos, " could not be removed!") // Set the new value in the tree

  };
  (0, _lodash2.default)(tree, updatedPos, currentVal); // Set the new schema data, with the new pos

  tree.schema[updatedPos] = _objectSpread({}, tree.schema[pos], schema, {
    // Overwrite the original pos with updated on
    value: currentVal,
    pos: updatedPos
  });
  schema.pos = updatedPos;
  (0, _clean_util.clearSchema)(tree.schema[pos], tree, false); // return the updated pos

  return {
    pos: updatedPos
  };
};
/**
 * Updates schema.open prop of the node in the tree, to the passed in prop
 * Updates the global tree object with the new position and schema
 * @param  { object } tree - object containing the entire jtree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { string } - updated position based on the new key
 */


exports.updateKey = updateKey;

var updateSchemaProp = function updateSchemaProp(tree, pos, schema, settings, prop) {
  if (prop in schema) tree.schema[pos][prop] = schema[prop];
};
/**
 * Adds a child schema to parent schema or tree
 * @param  {any} tree - full source and schema of entire data
 * @param  {any} schema - new schema to add
 * @param  {any} parent - parent schema to add child schema to
 * @return  { boolean } - true if schema is added to the parent
 */


exports.updateSchemaProp = updateSchemaProp;

var addChildSchema = function addChildSchema(tree, schema, parent) {
  if (!tree || !(0, _jsutils.isObj)(schema) || !(0, _jsutils.isObj)(parent)) return;
  var parentVal = (0, _lodash.default)(tree, parent.pos);
  if (!parentVal || _typeof(parentVal) !== 'object') return;
  schema.id = schema.id || (0, _jsutils.uuid)();
  if (tree.idMap[schema.id]) return (0, _jsutils.logData)("Can not add child to tree. Schema id already exists!", schema.id, tree.schema[tree.idMap[schema.id]], 'error');
  schema.key = schema.key || schema.id;
  schema.parent = parent;

  if (Array.isArray(parentVal)) {
    schema.pos = buildNewPos(parent.pos, parentVal.length, false);
    if (!checkSchemaPos(tree, schema.pos)) return;
    parentVal.push(schema.value);
  } else {
    schema.pos = schema.pos || buildNewPos(parent.pos, schema.key, false);
    if (!checkSchemaPos(tree, schema.pos)) return;
    parentVal[schema.key] = schema.value;
  }

  tree.idMap[schema.id] = schema.pos;
  tree.schema[schema.pos] = schema;
  return true;
};
/**
 * Adds a child schema to parent schema or tree
 * @param  {any} tree - full source and schema of entire data
 * @param  {any} schema - new schema to add
 * @param  {any} parent - parent schema to add child schema to
 * @return  { boolean } - true if schema is added to the parent
 */


exports.addChildSchema = addChildSchema;

var addRemoveSchema = function addRemoveSchema(add, remove, tree) {
  if (!tree) return null;
  if (remove && remove.pos) (0, _clean_util.clearSchema)(remove, tree, add && remove.instance !== add.instance);

  if (add) {
    if (!add.pos) return {
      error: "Can not add to schema, position is required!",
      key: 'pos'
    };else if (!add.id) return {
      error: "Can not add to schema, id is required!",
      key: 'id' // Set in tree

    };
    add.value && (0, _lodash2.default)(tree, add.pos, add.value); // Set in idMap

    add.id && (tree.idMap[add.id] = add.pos); // Set in schema

    tree.schema[add.pos] = add;
  }
};

exports.addRemoveSchema = addRemoveSchema;