'use strict';

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.string.split");

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

var _utils = require("./utils");

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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const UPDATE_ACTIONS = {
  matchType: _utils.updateType,
  value: _utils.updateValue,
  open: _utils.updateSchemaProp,
  mode: _utils.updateSchemaProp,
  error: _utils.updateSchemaProp // Cache holder for active source data

};
let ACT_SOURCE;
let TEMP;
/**
 * Updates the schema where the error occurred
 * Rebuilds the tree from the position the error occurred
 * @param  { object } jTree - jTree editor object
 * @param  { string } pos - location of the error
 * @param  { object } settings - config to for the tree data
 * @param  { string } prop - property where the error occurred
 * @param  { any } value - value that the error occurred on
 * @param  { string } message - error message
 *
 * @return { void }
 */

const handelUpdateError = (jTree, pos, settings, prop, value, message) => {
  if (!pos || !jTree.tree.schema[pos]) return (0, _jsutils.logData)(`Could not find ${pos} in the tree!`); // Update the schema for the node with the error

  (0, _utils.updateSchemaError)(jTree.tree, jTree.tree.schema[pos], settings, prop, value, message); // Re-render the tree from this pos, so the error is shown

  (0, _utils.buildFromPos)(jTree, pos, settings);
};

const doKeyUpdate = (jTree, update, pos, schema, settings) => {
  const valid = (0, _utils.validateKey)(update.key, jTree.tree, pos, schema); // If the key is not valid, then update the schema error

  if (!valid || valid.error) return handelUpdateError(jTree, pos, settings, 'key', update.key, valid.error);
  const updated = (0, _utils.updateKey)(jTree.tree, pos, schema, settings);
  if (!updated || updated.error) return handelUpdateError(jTree, pos, settings, 'key', update.key, updated.error);
  return updated.pos;
};

const doUpdateData = (jTree, update, pos, schema, settings) => {
  let invalid; // Loop over the allowed props to be update

  _constants.default.Schema.TREE_UPDATE_PROPS.map(prop => {
    // Only keep doing update when no error exists
    if (invalid) return; // If the prop exists in the update actions,
    // and the passed in update object
    // Then call the action to update it

    invalid = prop in update && (0, _jsutils.checkCall)(UPDATE_ACTIONS[prop], jTree.tree, pos, schema, settings, prop);
    if (!invalid) return;
    invalid.prop = prop;
    invalid.value = update[prop];
  });

  if (invalid && invalid.error) return handelUpdateError(jTree, pos, settings, invalid.prop, invalid.value, invalid.error);
  return true;
};

const addTempProp = jTree => {
  let TEMP_ID = false; // Add temp prop this way so we can set with string id
  // And when get it called, it returns with temp object

  (0, _utils.addProp)(jTree, 'temp', {
    get: () => {
      return _objectSpread({}, TEMP_ID && jTree.schema(TEMP_ID) || {}, {
        mode: _constants.default.Schema.MODES.TEMP
      });
    },
    set: id => {
      TEMP_ID = id;
    },
    enumerable: true,
    configurable: true
  });

  jTree.hasTemp = () => Boolean(TEMP_ID);
};

const NO_CONFIRM_KEYS = ['open', 'matchType'];
const NO_CONFIRM_MODES = ['edit'];

const shouldShowConfirm = update => {
  // Don't show confirm for only an update that is only an open
  const updateKeys = Object.keys(update);
  if (updateKeys.length !== 1) return true;
  if (update.mode && NO_CONFIRM_MODES.indexOf(update.mode.toLowerCase()) !== -1) return false;
  if (NO_CONFIRM_KEYS.indexOf(updateKeys[0]) !== -1) return false;
};

const createEditor = (settings, editorConfig, domContainer) => {
  class jTree {
    constructor() {
      _defineProperty(this, "buildTypes", source => {
        if (source && source !== ACT_SOURCE) return this.setSource(source);
        if (!(0, _jsutils.isObj)(ACT_SOURCE)) return (0, _jsutils.logData)(`Could build types, source data is invalid!`, ACT_SOURCE, 'warn');
        if ((0, _jsutils.isObj)(ACT_SOURCE)) this.tree = (0, _types.buildTypes)(ACT_SOURCE, settings, _utils.appendTreeHelper);
        return this;
      });

      _defineProperty(this, "setSource", (source, update) => {
        if (typeof source === 'string') source = (0, _jsutils.parseJSON)(source);
        if (!(0, _utils.validateSource)(source)) return undefined;
        ACT_SOURCE = (0, _utils.cloneDeep)(source);
        return update && this.buildTypes();
      });

      _defineProperty(this, "forceUpdate", pos => {
        pos && (0, _utils.buildFromPos)(this, pos, settings);
      });

      _defineProperty(this, "update", (idOrPos, update) => {
        let pos = this.tree.idMap[idOrPos] || idOrPos; // Ensure the passed in update object is valid

        const validData = (0, _utils.validateUpdate)(this.tree, idOrPos, update, settings); // And Ensure we have a schema, pos to use and there is no error

        if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(this, pos, settings, 'update', update, validData.error); // Get reference to the pos

        pos = validData.pos || pos;
        if (shouldShowConfirm(update) && !(0, _utils.checkConfirm)(validData.schema, pos, update, `${update.mode && (0, _jsutils.capitalize)(update.mode) || 'Update'} node at ${pos}?`)) return; // Remove the current error, if one exists

        validData.schema.error && (0, _lodash3.default)(validData.schema, 'error'); // Update the schema to ensure we are working with the updated data
        // Creates a copy of the current schema, with updated values

        let schema = (0, _utils.updateSchema)(update, _objectSpread({}, validData.schema)); // Check for an update to the key and handel it

        if ('key' in update) {
          const updatedPos = doKeyUpdate(this, update, pos, schema, settings);
          if (!updatedPos) return; // If there was a valid update to pos
          // Update the references to the local pos
          // So future references use the updated one

          pos = updatedPos;
        } // If there's an update, and pending exists before the matchType check
        // Remove it, pending only gets set on matchType update


        this.tree.schema[pos].pending && !update.matchType && (0, _lodash3.default)(this.tree.schema[pos], 'pending'); // Update the schema data, if nothing is returned,
        // then the update failed, so just return

        if (!doUpdateData(this, update, pos, schema, settings)) return;
        if (TEMP && TEMP.id === schema.id) TEMP = undefined;
        schema = undefined;
        validData.schema = undefined; // Rebuild the tree from this position

        (0, _utils.buildFromPos)(this, pos, settings);
      });

      _defineProperty(this, "replaceAtPos", (idOrPos, replace) => {
        // Ensure the passed in replace object is valid
        const validData = (0, _utils.validateUpdate)(this.tree, idOrPos, {
          mode: _constants.default.Schema.MODES.REPLACE
        }, settings); // And Ensure we have a schema and pos to use

        if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(this, this.tree.idMap[idOrPos] || idOrPos, settings, 'replace', null, validData.error); // Get the old schema

        const pos = validData.pos,
              schema = validData.schema;
        if (!(0, _utils.checkConfirm)(schema, pos, replace, `Replace ${schema.pos}?`)) return; // Update the replace object to include the original schemas location data

        replace.pos = schema.pos;
        replace.key = schema.key;
        replace.parent = schema.parent;
        replace.id = schema.id;
        (0, _utils.addSchemaComponent)(replace, replace.id);
        if (replace.mode === _constants.default.Schema.MODES.REPLACE || replace.mode === _constants.default.Schema.MODES.TEMP) (0, _lodash3.default)(replace, 'mode'); // If it's not the same instance, remove the old one
        // New one will be re-built on next render

        schema.instance !== replace.instance && (0, _lodash3.default)(replace, 'instance'); // Do deep clone of value to ensure it's not a ref to other object
        // Ensures it's not a ref pointer

        replace.value = (0, _utils.cloneDeep)(replace.value); // Add / Remove schemas from tree

        const invalid = (0, _utils.addRemoveSchema)(replace, schema, this.tree);
        if (invalid && invalid.error) return handelUpdateError(jTree, pos, settings, invalid.key, replace[invalid.key], invalid.error); // Re-render from the parentPos

        replace.parent && replace.parent.pos && (0, _utils.buildFromPos)(this, replace.parent && replace.parent.pos, settings);
      });

      _defineProperty(this, "remove", idOrPos => {
        // Ensure the passed in update object is valid
        const validData = (0, _utils.validateUpdate)(this.tree, idOrPos, {
          mode: _constants.default.Schema.MODES.REMOVE
        }, settings); // And Ensure we have a schema and pos to use

        if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(this, this.tree.idMap[idOrPos] || idOrPos, settings, 'remove', null, validData.error);
        const pos = validData.pos,
              schema = validData.schema;
        if (!(0, _utils.checkConfirm)(schema, pos, `Remove ${pos}?`)) return; // Clear the data from the tree

        (0, _lodash3.default)(this.tree, pos);
        (0, _lodash3.default)(this.tree.idMap, schema.id); // If parent is an array, Update the parent in place,
        // and remove the value from it

        Array.isArray(schema.parent.value) && schema.parent.value.splice(pos.split('.').pop(), 1); // Remove move the element from the dom

        const domNode = schema.domNode;
        (0, _utils.removeElement)(domNode, domNode.parentNode); // Get a ref to the parent pos for re-render

        const parentPos = schema.parent.pos; // Clear the schema from the tree schema

        (0, _utils.clearSchema)(schema, this.tree); // Re-render from the parentPos

        (0, _utils.buildFromPos)(this, parentPos, settings);
      });

      _defineProperty(this, "add", (schema, parent) => {
        const useParent = schema.parent || parent || this.tree.schema; // Validate the passed in data

        const isValid = (0, _utils.validateAdd)(schema, useParent);
        if (!isValid || isValid.error) return (0, _jsutils.logData)(isValid.error, schema, parent, this.tree, 'warn');
        if (schema.matchType !== _constants.default.Schema.EMPTY && !(0, _utils.checkConfirm)(schema, useParent.pos, `Add to parent ${useParent.pos}?`)) return; // Add the child schema to the parent / tree

        if (!(0, _utils.addChildSchema)(this.tree, schema, useParent)) return; // Rebuild the tree from parent position

        (0, _utils.buildFromPos)(this, useParent.pos, settings);
      });

      _defineProperty(this, "schema", idOrPos => (0, _lodash.default)(this, ['tree', 'schema', (0, _lodash.default)(this, `tree.idMap.${idOrPos}`, idOrPos)]));

      _defineProperty(this, "destroy", () => {
        ACT_SOURCE = undefined;
        const rootNode = this.tree.schema[_constants.default.Schema.ROOT].domNode;
        (0, _jsutils.clearObj)(this.tree[_constants.default.Schema.ROOT]);
        (0, _jsutils.clearObj)(this.tree.idMap);
        (0, _jsutils.clearObj)(this.config);
        this.Types.destroy(this);
        (0, _lodash3.default)(this, 'Types');
        (0, _lodash3.default)(this, 'element');
        (0, _utils.cleanUp)(settings, this.tree);
        (0, _jsutils.clearObj)(this);
        if (!rootNode || !rootNode.parentNode) return; // Remove the Root class from the parent

        rootNode.parentNode.classList && rootNode.parentNode.classList.remove(_constants.default.Values.ROOT_CLASS); // Remove the root element from the parent

        (0, _utils.removeElement)(rootNode, rootNode.parentNode);
      });

      this.Types = (0, _types.TypesCls)(settings);
      if (!this.Types) return (0, _jsutils.logData)(`Could not load types for editor!`, 'error');
      this.element = domContainer;
      this.element.classList.add(_constants.default.Values.ROOT_CLASS);

      const _source = editorConfig.source,
            config = _objectWithoutProperties(editorConfig, ["source"]);

      this.config = config;
      settings.Editor = this;
      !config.noTemp && addTempProp(this);
      return _source && this.setSource(_source, true);
    }

  }

  return new jTree();
};

const init = opts => {
  if (opts.showLogs) (0, _jsutils.setLogs)(true);
  const domContainer = (0, _utils.getElement)(opts.element);
  if (!domContainer) return (0, _jsutils.logData)(`Dom node ( element ) is required when calling the jTree init method`, 'error'); // Remove element, and showLogs cause we don't need them anymore

  const element = opts.element,
        showLogs = opts.showLogs,
        editor = opts.editor,
        options = _objectWithoutProperties(opts, ["element", "showLogs", "editor"]); // Clean up the opts.element so we don't have a memory leak


  opts.element = undefined; // Build the settings by joining with the default settings

  const settings = (0, _jsutils.deepMerge)(_constants.DEF_SETTINGS, options);
  const editorConfig = (0, _jsutils.deepMerge)(_constants.default.EditorConfig, editor); // Enable confirm actions

  (0, _utils.setConfirm)(editorConfig.confirmActions); // Create the jTree Editor

  return createEditor(settings, editorConfig, domContainer);
};

exports.init = init;