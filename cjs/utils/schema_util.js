"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.map");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFromPos = exports.appendTreeHelper = exports.loopSource = exports.buildSchema = exports.addSchemaComponent = void 0;

var _instance_util = require("./instance_util");

var _jsutils = require("jsutils");

var _types_util = require("./types_util");

var _match_util = require("./match_util");

var _dom_util = require("./dom_util");

var _object_util = require("./object_util");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Ensures the props object is not changed durring the render method of a Type
 * Helps to ensure props is only update through the editor
 * @param  { object } props - object passed to instance methods
 * @param  { object } check - props to check against
 *
 * @return { void }
 */
const checkPropsChange = (props, check) => props && Object.keys(props).map(key => {
  if (props[key] !== check[key]) throw new Error(`Props should not be changed when rendering a domNode!`);
  if (typeof props[key] === 'object' && _constants.default.Schema.PROPS_CHECK.indexOf(key) === -1) checkPropsChange(props[key], check[key]);
});
/**
 * Adds the domNode prop to the schema, as a getter / setter
 * Allows getting the dom node when called instead of caching it
 * Helps to prevent memory leaks 
 * @param  { object } schema - schema to start the loop process
 * @param  { string } id - dom node id connecting the schema and dom node
 *
 * @return { void }
 */


const addSchemaComponent = (schema, id) => (0, _object_util.addProp)(schema, 'domNode', {
  get: () => document.getElementById(id),
  set: _id => {
    if (_id && _id !== id) id = _id;
  },
  enumerable: true,
  configurable: true
});
/**
 * Rebuilds the schema for a value in the tree
 * Builds the instance from the Type based on the value
 * @param  { object } curSchema - schema to start the loop process
 * @param  { object } type - current type of the value
 * @param  { object } settings - config to for the tree data
 *
 * @return { object } - build schema object
 */


exports.addSchemaComponent = addSchemaComponent;

const buildSchema = (curSchema, type, settings) => {
  const schema = _objectSpread({}, curSchema, {
    pos: (0, _instance_util.buildInstancePos)(curSchema.key, curSchema.parent),
    id: curSchema.id || (0, _jsutils.uuid)(),
    keyType: curSchema.parent && Array.isArray(curSchema.parent.value) ? 'number' : 'text',
    matchType: curSchema.matchType || (0, _types_util.buildTypeName)(type.name || type.factory.name)
  });

  !schema.instance && (0, _instance_util.buildInstance)(type, schema, settings);
  return schema;
};
/**
 * Loops over the curSchema. Updates it based on any changed values,
 * Calls the render method of the curSchemas type
 * @param  { object } curSchema - schema to start the loop process
 * @param  { object } tree - current tree data
 * @param  { object } settings - config to for the tree data
 * @param  { function } elementCb - callback to build the dom element
 *
 * @return { object || dom element } - tree if root element otherwise dom element
 */


exports.buildSchema = buildSchema;

const loopSource = (curSchema, tree, settings, elementCb) => {
  const value = curSchema.value,
        key = curSchema.key,
        parent = curSchema.parent,
        pos = curSchema.pos,
        pending = curSchema.pending,
        mode = curSchema.mode;
  const Types = settings.Editor.Types;
  const isRoot = key === _constants.default.Schema.ROOT;
  const cutMode = mode === _constants.default.Schema.MODES.CUT; // pending gets set when empty value is added, and the type was updated
  // This will switch it to edit mode, but the key and value will be empty
  // It also set the type when it was switched
  // So skip check the types here, so we don't override it

  const matchTypes = !cutMode && !pending && Types.getValueTypes(value, settings); // Get the type based on the found types, or the current type
  // If pending is set, but use the current type on the schema

  const type = pending ? !cutMode && Types.get(curSchema.matchType) : !cutMode && (0, _match_util.checkMultiMatches)(matchTypes, curSchema, tree, settings); // Check if the type has a factory to call, if not just return

  if (cutMode || !type || !type.factory || !(0, _object_util.isConstructor)(type.factory)) {
    if (cutMode) {
      curSchema.domNode = undefined;
      curSchema.parent = undefined;
      curSchema.id = undefined;
    }

    return isRoot ? tree : null;
  } // Build an updated schema based on the new settings


  const schema = buildSchema(curSchema, type, settings); // If not the root element, set the parent to the schema

  !isRoot ? schema.parent = parent : schema.isRoot = true; // If an old schema exists at this pos, clear it out
  // Add the schema to the tree based on pos

  tree.schema[schema.pos] = schema; // Props helper to make it easier to manage

  let props = {
    schema,
    tree,
    settings // Check if there is a shouldUpdate method, and is so call it

  };
  const shouldUpdate = (0, _jsutils.checkCall)(schema.instance.shouldComponentUpdate, curSchema, props);

  if (shouldUpdate === false) {
    // Should make instance a defined prop like domNode
    // Then in the getters and setters, have it update the instance cache
    schema.instance = undefined;
    tree.idMap[schema.id] = schema.pos;
    props = undefined;
    return '';
  }

  if (isRoot && !curSchema.id) {
    props.schema.open = (0, _jsutils.get)(settings, 'Editor.config.root.start') === 'open';
    props.schema.keyText = (0, _jsutils.get)(settings, 'Editor.config.root.title', schema.key);
  } // Render the domNode and it's children


  let domNode = (0, _instance_util.renderInstance)(key, value, props, loopSource); // Use the id to set the domNode prop on the schema

  domNode && domNode.id && addSchemaComponent(schema, domNode.id); // Add the dom domNodes Id to the idMap
  // This will help with looking up the schema later

  tree.idMap[domNode && domNode.id || schema.id] = schema.pos; // If we are not on the root element of the tree, 
  // Ensure the props get cleared out and return the rendered domNode

  if (!isRoot) return (props = undefined) || domNode; // Only the root domNode should get to this point
  // Call the appendTree method to add the domNode tree to the dom

  elementCb && (0, _jsutils.checkCall)(elementCb, settings.Editor, domNode, settings.Editor.config.appendTree, tree); // Set domNode and props to undefined, to ensure it get's cleaned up
  // as it's longer being used

  domNode = undefined;
  props = undefined; // Then return the build tree

  return tree;
};
/**
 * Checks if the settings.Editor.config.appendTree method exists, and calls it
 * If response is not false, it will add the rootComp the Dom
 * @param  { dom element } rootComp of the source data passed to the Editor
 * @param  { function } appendTree - from Editor.config.appendTree (from user)
 *                                 - should always be bound to the Editor Class
 *
 * @return { void }
 */


exports.loopSource = loopSource;

const appendTreeHelper = (jtree, rootComp, appendTree, tree) => {
  const res = (0, _jsutils.checkCall)(appendTree, rootComp, jtree, tree);
  if (res === false || !jtree.element) return null;
  (0, _dom_util.upsertElement)(rootComp, jtree.element);
  const pos = tree.idMap[rootComp.id];
  (0, _instance_util.callInstanceUpdates)(tree, pos);
};
/**
 * Rebuilds the dom from a position in the tree
 * Only that pos and it's children are re-build
 * @param  { object } jtree - jtree editor object
 * @param  { string } pos - location to start rebuild from
 * @param  { object } settings - config to for the tree data
 *
 * @return { object || dom element } - tree if root element otherwise dom element
 */


exports.appendTreeHelper = appendTreeHelper;

const buildFromPos = (jtree, pos, settings) => {
  if (!(0, _jsutils.isStr)(pos) || !jtree.tree.schema[pos]) return logData(`Rebuild was called, but ${pos} does not exist it the tree`, jtree.tree, pos, 'warn');
  const renderSchema = jtree.tree.schema[pos];
  const updatedEl = loopSource(renderSchema, jtree.tree, settings, appendTreeHelper); // If updated element was not returned,
  // remove the current element from the dom

  if (updatedEl === null) {
    const domNode = renderSchema.domNode;
    return domNode && (0, _dom_util.removeElement)(domNode, domNode.parentNode);
  } // This method should not be called with the root schema
  // If it was, just return


  if (pos === _constants.default.Schema.ROOT || Boolean(updatedEl instanceof HTMLElement) === false) return; // Adds the dom node to the tree

  (0, _dom_util.upsertElement)(updatedEl, renderSchema.domNode); // Calls the domNode life cycle methods

  (0, _instance_util.callInstanceUpdates)(jtree.tree, renderSchema.pos);
};

exports.buildFromPos = buildFromPos;