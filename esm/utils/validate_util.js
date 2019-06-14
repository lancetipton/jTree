"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateKey = exports.validateAdd = exports.validateUpdate = exports.validateSource = exports.validateBuildTypes = exports.validateMatchType = void 0;

var _jsutils = require("jsutils");

var _object_util = require("./object_util");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Validates a key in the context of an Array
 * Array keys must be an index in the array, or the same as array length
 * @param  { string } key - index to be validated
 * @param  { array } parentVal - array the key is validated against
 * @param  { object } schema - data about the key in the parentVal
 *
 * @return { object } contains error data if one exists
 */
var validateKeyInArray = function validateKeyInArray(key, parentVal, schema) {
  var invalid;
  var index = parseInt(key);

  if (!isNaN(index)) {
    var parKeys = Object.keys(parentVal);
    invalid = parKeys.indexOf(index) === -1 && parKeys.length !== index;
  } else invalid = true; // Array keys must be an index
  // Check if in the current array of index
  // or it's equal to the length, so it's being added as the next node, 


  return invalid ? {
    error: "Key '".concat(key, "'' must be a numbered index for Type ").concat(schema.instance.name, "!")
  } : {
    error: false
  };
};
/**
 * Validates a new type to ensure if has not already been registered
 * @param  { object } newType - new object to be validated
 * @param  { Object } TYPE_CACHE - stores currently registered type classes
 * @return { boolean }
 */


var validateMatchType = function validateMatchType(checkType, TYPE_CACHE) {
  var failedClsProps = _constants.default.Schema.TYPE_CLASS_CHECK.reduce(function (failedCheck, prop) {
    !checkType.hasOwnProperty(prop) && failedCheck.push(prop);
    return failedCheck;
  }, []);

  if (failedClsProps.length) return (0, _jsutils.logData)("Could not register type '".concat(checkType.name || 'Type', "'. It's missing these static properties:\n\t").concat(failedClsProps.join('\n\t')), 'error');
  if (TYPE_CACHE && TYPE_CACHE[checkType.name]) return (0, _jsutils.logData)("Type with name ".concat(checkType.name, " is already registered!"), 'error');
  if (!(0, _object_util.isConstructor)(checkType)) return (0, _jsutils.logData)("New Types must be a constructor!", 'error');
  return true;
};
/**
 * Ensures the Editor types class is loaded
 * @param  { object } source 
 * @param  { Editor Class } Editor 
 * @return { boolean }
 */


exports.validateMatchType = validateMatchType;

var validateBuildTypes = function validateBuildTypes(source, Editor) {
  if (!validateSource(source)) return false;
  if (!(0, _jsutils.isObj)(Editor.Types) || typeof Editor.Types.get !== 'function') return (0, _jsutils.logData)("Editor.Types class is required when building the editor types!", 'error');
  return true;
};
/**
 * Ensures the passed in source is an object
 * @param  { object } source 
 * @return { boolean }
 */


exports.validateBuildTypes = validateBuildTypes;

var validateSource = function validateSource(source) {
  if (!(0, _jsutils.isObj)(source)) return (0, _jsutils.logData)("Could update source. Please make sure source param is an Object or JSON parse-able string", 'error');
  return true;
};
/**
 * Validate the passed in params to ensure proper data is used whe updating the tree schema
 * @param  { string } idOrPos - location of the value to be updated
 * @param  { object } update - describes what should be update
 * @param  { object } tree - holds the source and schema for of the active object
 *
 * @return { object } contains error data if one exists
 */


exports.validateSource = validateSource;

var validateUpdate = function validateUpdate(tree, idOrPos, update, settings) {
  var res = {};
  if (!idOrPos) return {
    error: "Update requires an id or position!" // Get the pos to be updated

  };
  var pos = tree.idMap[idOrPos] || idOrPos; // Check if the pos exists,

  if (!pos || !tree.schema[pos]) return {
    error: "Could not find position ".concat(idOrPos, " in the tree!") // Get the current data in the tree, and the current schema

  };
  var schema = tree.schema[pos];
  var isEmptyType = schema.matchType === _constants.default.Schema.EMPTY; //  Check if data in the tree, or if it was an empty type

  if (!schema && !isEmptyType) return {
    error: "Could not find node in tree that matches ".concat(idOrPos, "!") // Check if the update is an object

  };

  if (!(0, _jsutils.isObj)(update)) {
    error: "Update method third argument must be an object!";
  } // Finished validating for REMOVE and REPLACE updates


  if (update.mode === _constants.default.Schema.MODES.REMOVE || update.mode === _constants.default.Schema.MODES.REPLACE) return {
    schema: schema,
    pos: pos // Check if in add more, but no match type exists
    // If adding a node to the tree, we must know what type it should be

  };
  if (schema.mode === _constants.default.Schema.MODES.ADD && !update.matchType) return {
    error: "A valid type is required to update the item!" // Validate the update properties, to ensure we only update what is allowed

  };
  var nonValid = Object.keys(update).reduce(function (notValid, prop) {
    if (_constants.default.Schema.TREE_UPDATE_PROPS.indexOf(prop) == -1) notValid = prop;
    return notValid;
  }, false); // If no valid update props, log and return

  if (nonValid) return {
    error: "".concat(nonValid, " is not a valid update property")
  };
  return {
    schema: schema,
    pos: pos
  };
};
/**
 * Validates adding new schema to a parent node to ensure it has correct data
 *
 * @param  { object } schema - schema to add to the parent
 * @param  { object } parent - schema object to add the child schema to
 *
 * @return { object } contains error data if one exists
 */


exports.validateUpdate = validateUpdate;

var validateAdd = function validateAdd(schema, parent) {
  return !(0, _jsutils.isObj)(schema) ? {
    error: "Add method requires a valid schema object as the first argument"
  } : !(0, _jsutils.isObj)(parent) || !parent.value || !parent.pos ? {
    error: "Add method requires a valid parent schema"
  } : _typeof(parent.value) !== 'object' ? {
    error: "Parent value must equal type 'object' ( Object || Array )"
  } : {
    error: false
  };
};
/**
 * Validates a new key for a value as a position in the tree
 *
 * @param  { string || number } key - key to be validated
 * @param  { object } tree - holds the source and schema for of the active object
 * @param  { string } pos - location of the value to be updated
 * @param  { object } schema - data about the value found at the passed in pos
 *
 * @return { object } contains error data if one exists
 */


exports.validateAdd = validateAdd;

var validateKey = function validateKey(key, tree, pos, schema) {
  if (!key && key !== 0) return {
    error: "Can not set key to a falsy value!"
  };
  if (!tree.schema[pos]) return {
    error: "Position '".concat(pos, "' does not exist, can not update key!")
  };
  var parentVal = schema.parent.value;
  if (Array.isArray(parentVal)) return validateKeyInArray(key, parentVal, schema);
  var noString = "Invalid key value: ".concat(key, ". Could not convert ").concat(key, " into a string!");

  try {
    return {
      error: typeof key.toString() === 'string' ? false : noString
    };
  } catch (e) {
    return {
      error: noString
    };
  }
};

exports.validateKey = validateKey;