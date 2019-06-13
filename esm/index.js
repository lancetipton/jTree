'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Constants", {
  enumerable: true,
  get: function get() {
    return _constants.default;
  }
});
exports.init = void 0;

var _jTUtils = require("jTUtils");

var _jsutils = require("jsutils");

var _constants = _interopRequireWildcard(require("./constants"));

var _types = require("./types");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.set"));

var _lodash3 = _interopRequireDefault(require("lodash.unset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var UPDATE_ACTIONS = {
  matchType: _jTUtils.updateType,
  value: _jTUtils.updateValue,
  open: _jTUtils.updateSchemaProp,
  mode: _jTUtils.updateSchemaProp,
  error: _jTUtils.updateSchemaProp // Cache holder for active source data

};
var ACT_SOURCE;
var TEMP;
/**
 * Updates the schema where the error occurred
 * Rebuilds the tree from the position the error occurred
 * @param  { object } jtree - jtree editor object
 * @param  { string } pos - location of the error
 * @param  { object } settings - config to for the tree data
 * @param  { string } prop - property where the error occurred
 * @param  { any } value - value that the error occurred on
 * @param  { string } message - error message
 *
 * @return { void }
 */

var handelUpdateError = function handelUpdateError(jtree, pos, settings, prop, value, message) {
  if (!pos || !jtree.tree.schema[pos]) return (0, _jsutils.logData)("Could not find ".concat(pos, " in the tree!")); // Update the schema for the node with the error

  (0, _jTUtils.updateSchemaError)(jtree.tree, jtree.tree.schema[pos], settings, prop, value, message); // Re-render the tree from this pos, so the error is shown

  (0, _jTUtils.buildFromPos)(jtree, pos, settings);
};

var doKeyUpdate = function doKeyUpdate(jtree, update, pos, schema, settings) {
  var valid = (0, _jTUtils.validateKey)(update.key, jtree.tree, pos, schema); // If the key is not valid, then update the schema error

  if (!valid || valid.error) return handelUpdateError(jtree, pos, settings, 'key', update.key, valid.error);
  var updated = (0, _jTUtils.updateKey)(jtree.tree, pos, schema, settings);
  if (!updated || updated.error) return handelUpdateError(jtree, pos, settings, 'key', update.key, updated.error);
  return updated.pos;
};

var doUpdateData = function doUpdateData(jtree, update, pos, schema, settings) {
  var invalid; // Loop over the allowed props to be update

  _constants.default.Schema.TREE_UPDATE_PROPS.map(function (prop) {
    // Only keep doing update when no error exists
    if (invalid) return; // If the prop exists in the update actions,
    // and the passed in update object
    // Then call the action to update it

    invalid = prop in update && (0, _jsutils.checkCall)(UPDATE_ACTIONS[prop], jtree.tree, pos, schema, settings, prop);
    if (!invalid) return;
    invalid.prop = prop;
    invalid.value = update[prop];
  });

  if (invalid && invalid.error) return handelUpdateError(jtree, pos, settings, invalid.prop, invalid.value, invalid.error);
  return true;
};

var addTempProp = function addTempProp(jtree) {
  var TEMP_ID = false; // Add temp prop this way so we can set with string id
  // And when get it called, it returns with temp object

  (0, _jTUtils.addProp)(jtree, 'temp', {
    get: function get() {
      return _objectSpread({}, TEMP_ID && jtree.schema(TEMP_ID) || {}, {
        mode: _constants.default.Schema.MODES.TEMP
      });
    },
    set: function set(id) {
      TEMP_ID = id;
    },
    enumerable: true,
    configurable: true
  });

  jtree.hasTemp = function () {
    return Boolean(TEMP_ID);
  };
};

var NO_CONFIRM_KEYS = ['open', 'matchType'];
var NO_CONFIRM_MODES = ['edit'];

var shouldShowConfirm = function shouldShowConfirm(update) {
  // Don't show confirm for only an update that is only an open
  var updateKeys = Object.keys(update);
  if (updateKeys.length !== 1) return true;
  if (update.mode && NO_CONFIRM_MODES.indexOf(update.mode.toLowerCase()) !== -1) return false;
  if (NO_CONFIRM_KEYS.indexOf(updateKeys[0]) !== -1) return false;
};

var createEditor = function createEditor(settings, editorConfig, domContainer) {
  var jtree = function jtree() {
    var _this = this;

    _classCallCheck(this, jtree);

    _defineProperty(this, "buildTypes", function (source) {
      if (source && source !== ACT_SOURCE) return _this.setSource(source);
      if (!(0, _jsutils.isObj)(ACT_SOURCE)) return (0, _jsutils.logData)("Could build types, source data is invalid!", ACT_SOURCE, 'warn');
      if ((0, _jsutils.isObj)(ACT_SOURCE)) _this.tree = (0, _types.buildTypes)(ACT_SOURCE, settings, _jTUtils.appendTreeHelper);
      return _this;
    });

    _defineProperty(this, "setSource", function (source, update) {
      if (typeof source === 'string') source = (0, _jsutils.parseJSON)(source);
      if (!(0, _jTUtils.validateSource)(source)) return undefined;
      ACT_SOURCE = (0, _jTUtils.cloneDeep)(source);
      return update && _this.buildTypes();
    });

    _defineProperty(this, "forceUpdate", function (pos) {
      pos && (0, _jTUtils.buildFromPos)(_this, pos, settings);
    });

    _defineProperty(this, "update", function (idOrPos, update) {
      var pos = _this.tree.idMap[idOrPos] || idOrPos; // Ensure the passed in update object is valid

      var validData = (0, _jTUtils.validateUpdate)(_this.tree, idOrPos, update, settings); // And Ensure we have a schema, pos to use and there is no error

      if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(_this, pos, settings, 'update', update, validData.error); // Get reference to the pos

      pos = validData.pos || pos;
      if (shouldShowConfirm(update) && !(0, _jTUtils.checkConfirm)(validData.schema, pos, update, "".concat(update.mode && (0, _jsutils.capitalize)(update.mode) || 'Update', " node at ").concat(pos, "?"))) return; // Remove the current error, if one exists

      validData.schema.error && (0, _lodash3.default)(validData.schema, 'error'); // Update the schema to ensure we are working with the updated data
      // Creates a copy of the current schema, with updated values

      var schema = (0, _jTUtils.updateSchema)(update, _objectSpread({}, validData.schema)); // Check for an update to the key and handel it

      if ('key' in update) {
        var updatedPos = doKeyUpdate(_this, update, pos, schema, settings);
        if (!updatedPos) return; // If there was a valid update to pos
        // Update the references to the local pos
        // So future references use the updated one

        pos = updatedPos;
      } // If there's an update, and pending exists before the matchType check
      // Remove it, pending only gets set on matchType update


      _this.tree.schema[pos].pending && !update.matchType && (0, _lodash3.default)(_this.tree.schema[pos], 'pending'); // Update the schema data, if nothing is returned,
      // then the update failed, so just return

      if (!doUpdateData(_this, update, pos, schema, settings)) return;
      if (TEMP && TEMP.id === schema.id) TEMP = undefined;
      schema = undefined;
      validData.schema = undefined; // Rebuild the tree from this position

      (0, _jTUtils.buildFromPos)(_this, pos, settings);
    });

    _defineProperty(this, "replaceAtPos", function (idOrPos, replace) {
      // Ensure the passed in replace object is valid
      var validData = (0, _jTUtils.validateUpdate)(_this.tree, idOrPos, {
        mode: _constants.default.Schema.MODES.REPLACE
      }, settings); // And Ensure we have a schema and pos to use

      if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(_this, _this.tree.idMap[idOrPos] || idOrPos, settings, 'replace', null, validData.error); // Get the old schema

      var pos = validData.pos,
          schema = validData.schema;
      if (!(0, _jTUtils.checkConfirm)(schema, pos, replace, "Replace ".concat(schema.pos, "?"))) return; // Update the replace object to include the original schemas location data

      replace.pos = schema.pos;
      replace.key = schema.key;
      replace.parent = schema.parent;
      replace.id = schema.id;
      (0, _jTUtils.addSchemaComponent)(replace, replace.id);
      if (replace.mode === _constants.default.Schema.MODES.REPLACE || replace.mode === _constants.default.Schema.MODES.TEMP) (0, _lodash3.default)(replace, 'mode'); // If it's not the same instance, remove the old one
      // New one will be re-built on next render

      schema.instance !== replace.instance && (0, _lodash3.default)(replace, 'instance'); // Do deep clone of value to ensure it's not a ref to other object
      // Ensures it's not a ref pointer

      replace.value = (0, _jTUtils.cloneDeep)(replace.value); // Add / Remove schemas from tree

      var invalid = (0, _jTUtils.addRemoveSchema)(replace, schema, _this.tree);
      if (invalid && invalid.error) return handelUpdateError(jtree, pos, settings, invalid.key, replace[invalid.key], invalid.error); // Re-render from the parentPos

      replace.parent && replace.parent.pos && (0, _jTUtils.buildFromPos)(_this, replace.parent && replace.parent.pos, settings);
    });

    _defineProperty(this, "remove", function (idOrPos) {
      // Ensure the passed in update object is valid
      var validData = (0, _jTUtils.validateUpdate)(_this.tree, idOrPos, {
        mode: _constants.default.Schema.MODES.REMOVE
      }, settings); // And Ensure we have a schema and pos to use

      if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(_this, _this.tree.idMap[idOrPos] || idOrPos, settings, 'remove', null, validData.error);
      var pos = validData.pos,
          schema = validData.schema;
      if (!(0, _jTUtils.checkConfirm)(schema, pos, "Remove ".concat(pos, "?"))) return; // Clear the data from the tree

      (0, _lodash3.default)(_this.tree, pos);
      (0, _lodash3.default)(_this.tree.idMap, schema.id); // If parent is an array, Update the parent in place,
      // and remove the value from it

      Array.isArray(schema.parent.value) && schema.parent.value.splice(pos.split('.').pop(), 1); // Remove move the element from the dom

      var domNode = schema.domNode;
      (0, _jTUtils.removeElement)(domNode, domNode.parentNode); // Get a ref to the parent pos for re-render

      var parentPos = schema.parent.pos; // Clear the schema from the tree schema

      (0, _jTUtils.clearSchema)(schema, _this.tree); // Re-render from the parentPos

      (0, _jTUtils.buildFromPos)(_this, parentPos, settings);
    });

    _defineProperty(this, "add", function (schema, parent) {
      var useParent = schema.parent || parent || _this.tree.schema; // Validate the passed in data

      var isValid = (0, _jTUtils.validateAdd)(schema, useParent);
      if (!isValid || isValid.error) return (0, _jsutils.logData)(isValid.error, schema, parent, _this.tree, 'warn');
      if (schema.matchType !== _constants.default.Schema.EMPTY && !(0, _jTUtils.checkConfirm)(schema, useParent.pos, "Add to parent ".concat(useParent.pos, "?"))) return; // Add the child schema to the parent / tree

      if (!(0, _jTUtils.addChildSchema)(_this.tree, schema, useParent)) return; // Rebuild the tree from parent position

      (0, _jTUtils.buildFromPos)(_this, useParent.pos, settings);
    });

    _defineProperty(this, "schema", function (idOrPos) {
      return (0, _lodash.default)(_this, ['tree', 'schema', (0, _lodash.default)(_this, "tree.idMap.".concat(idOrPos), idOrPos)]);
    });

    _defineProperty(this, "destroy", function () {
      ACT_SOURCE = undefined;
      var rootNode = _this.tree.schema[_constants.default.Schema.ROOT].domNode;
      (0, _jsutils.clearObj)(_this.tree[_constants.default.Schema.ROOT]);
      (0, _jsutils.clearObj)(_this.tree.idMap);
      (0, _jsutils.clearObj)(_this.config);

      _this.Types.destroy(_this);

      (0, _lodash3.default)(_this, 'Types');
      (0, _lodash3.default)(_this, 'element');
      (0, _jTUtils.cleanUp)(settings, _this.tree);
      (0, _jsutils.clearObj)(_this);
      if (!rootNode || !rootNode.parentNode) return; // Remove the Root class from the parent

      rootNode.parentNode.classList && rootNode.parentNode.classList.remove(_constants.default.Values.ROOT_CLASS); // Remove the root element from the parent

      (0, _jTUtils.removeElement)(rootNode, rootNode.parentNode);
    });

    this.Types = (0, _types.TypesCls)(settings);
    if (!this.Types) return (0, _jsutils.logData)("Could not load types for editor!", 'error');
    this.element = domContainer;
    this.element.classList.add(_constants.default.Values.ROOT_CLASS);

    var _source = editorConfig.source,
        config = _objectWithoutProperties(editorConfig, ["source"]);

    this.config = config;
    settings.Editor = this;
    !config.noTemp && addTempProp(this);
    return _source && this.setSource(_source, true);
  };

  return new jtree();
};

var init = function init(opts) {
  if (opts.showLogs) (0, _jsutils.setLogs)(true);
  var domContainer = (0, _jTUtils.getElement)(opts.element);
  if (!domContainer) return (0, _jsutils.logData)("Dom node ( element ) is required when calling the jtree init method", 'error'); // Remove element, and showLogs cause we don't need them anymore

  var element = opts.element,
      showLogs = opts.showLogs,
      editor = opts.editor,
      options = _objectWithoutProperties(opts, ["element", "showLogs", "editor"]); // Clean up the opts.element so we don't have a memory leak


  opts.element = undefined; // Build the settings by joining with the default settings

  var settings = (0, _jsutils.deepMerge)(_constants.DEF_SETTINGS, options);
  var editorConfig = (0, _jsutils.deepMerge)(_constants.default.EditorConfig, editor); // Enable confirm actions

  (0, _jTUtils.setConfirm)(editorConfig.confirmActions); // Create the jtree Editor

  return createEditor(settings, editorConfig, domContainer);
};

exports.init = init;