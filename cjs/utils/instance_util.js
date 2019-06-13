"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.values");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callInstanceUpdates = exports.renderInstance = exports.buildInstance = exports.clearInstance = exports.getInstanceCache = exports.clearInstanceCache = exports.buildInstancePos = void 0;

var _jsutils = require("jsutils");

var _types_util = require("./types_util");

var _clean_util = require("./clean_util");

var _object_util = require("./object_util");

var _constants = _interopRequireDefault(require("../constants"));

var _lodash = _interopRequireDefault(require("lodash.unset"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let INSTANCE_CACHE;
/**
 * Finds the child schema based on the passed in parent schema and key
 * @param { string } key - key to the child within the parent Object or Array 
 * @param { any } value - value to the child within the parent Object or Array 
 * @param { object } { tree, schema } - holder for the instance schema,  and full tree
 * 
 * @return { object } - found child schema
 */

const getChildSchema = (key, value, {
  tree,
  schema
}) => _objectSpread({}, tree.schema[buildInstancePos(key, schema)] || {}, {
  key,
  value,
  parent: schema
});
/**
 * Builds an instance child schema when instance value is an Array or Object
 * @param {*} childKey - key tied to the instance through the schema
 * @param {*} child - value of the child to be built when parent is an Array or Object
 * @param {*} props - holder for the instance schema, editor settings, and full tree
 * @param { function } loopChildren - method to loop over the instance children
 * 
 * @return { any } - build child or undefined when child can not be built
 */


const buildChild = (childKey, child, props, loopChildren) => {
  if (props.schema.open) return loopChildren(getChildSchema(childKey, child, props), props.tree, props.settings);
  const childPos = buildInstancePos(childKey, props.schema);
  const schema = props.tree.schema[childPos];
  if (!schema || !schema.instance || !schema.domNode) return;
  (0, _clean_util.clearSchema)(schema, props.tree);
  return undefined;
};
/**
 * Builds an instance position based on passed in key and parent
 * @param  {string} key - key of the instance within the tree source
 * @param  { object } parent - parent schema of the instance
 * 
 * @return { string } - built instance position within the source tree
 */


const buildInstancePos = (key, parent) => key === _constants.default.Schema.ROOT ? key : `${parent.pos}.${key}`;
/**
 * Clears the INSTANCE_CACHE object of all instances 
 * 
 * @return { void }
 */


exports.buildInstancePos = buildInstancePos;

const clearInstanceCache = () => {
  (0, _jsutils.clearObj)(INSTANCE_CACHE);
  INSTANCE_CACHE = undefined;
};
/**
 * Get all the instances or a single instance when an id is passed in
 * @param  {string} id - id of the instance to be removed
 * 
 * @return { object } - INSTANCE_CACHE or found instance when id is passed in
 */


exports.clearInstanceCache = clearInstanceCache;

const getInstanceCache = id => !id && INSTANCE_CACHE || INSTANCE_CACHE && INSTANCE_CACHE[id];
/**
 * Removes an instance from the instance cache
 * @param  { string } id - id of the instance to be removed
 * 
 * @return { boolean } - if the instance was removed
 */


exports.getInstanceCache = getInstanceCache;

const clearInstance = (id, instance) => {
  instance = instance || INSTANCE_CACHE && INSTANCE_CACHE[id];
  if (!instance) return false;
  (0, _jsutils.isFunc)(instance.componentWillUnmount) && instance.componentWillUnmount();
  instance.state = undefined;
  instance.setState = undefined;
  (0, _jsutils.clearObj)(instance);
  id = id || INSTANCE_CACHE && Object.keys(INSTANCE_CACHE)[Object.values(INSTANCE_CACHE).indexOf(instance)];
  if (!id) return false;
  INSTANCE_CACHE[id] && (INSTANCE_CACHE[id] = undefined);
  (0, _lodash.default)(INSTANCE_CACHE, id);
  instance = undefined;
  return true;
};
/**
 * Builds an instance based on the passed in type, and settings
 * Binds any custom events in the settings to the instance 
 * Overrides instance methods to allow passing in the Editor
 * @param { object } type - object built from the type_util
 * @param { object } schema - current schema the instance will be tied to
 * @param { object } settings - current Editor settings
 * 
 * @returns { object } - built instance
 */


exports.clearInstance = clearInstance;

const buildInstance = (type, schema, settings) => {
  const id = schema.id,
        matchType = schema.matchType;
  INSTANCE_CACHE = INSTANCE_CACHE || {}; // Check for cached instance

  if (!INSTANCE_CACHE[id]) {
    // Get the config from the passed in settings
    const config = (0, _jsutils.get)(settings.types, `config.${matchType}`) || {};
    const editorConfig = settings.Editor.config || {}; // Add editor methods to the instance if none defined

    (0, _jsutils.mapObj)(_constants.default.Values.CUSTOM_EVENTS, (key, value) => !config[key] && editorConfig[key] && (config[key] = editorConfig[key])); // If no cached instance, built new one from factory

    const instance = new type.factory(config, settings.Editor); // Check for config overrides from the passed in settings

    config && (0, _types_util.typesOverride)(instance, config); // Wrap the methods on the instance, so we can pass the Editor into them when called

    Object.keys(instance).map(key => {
      if (!(0, _jsutils.isFunc)(instance[key])) return;
      const orgMethod = instance[key];

      instance[key] = (...args) => {
        if (!_constants.default.Values.CUSTOM_EVENTS[key]) return orgMethod(...args, settings.Editor);
        let callOrg = false;
        let hasOverride = (0, _jsutils.isFunc)(editorConfig[key]);

        if (hasOverride) {
          if (editorConfig.eventOverride === 'instance') callOrg = true;else if (settings.Editor.config[key](...args, settings.Editor) !== false) callOrg = true;
        }

        if (!hasOverride || callOrg) return orgMethod(...args, settings.Editor);
      };
    }); // Add the instance to the instance cache

    INSTANCE_CACHE[id] = instance;
  } // Add the new instance prop


  let NEW_INSTANCE = true;
  (0, _object_util.addProp)(schema, 'newInstance', {
    get: () => NEW_INSTANCE,
    set: update => {
      NEW_INSTANCE = undefined;
      (0, _lodash.default)(schema, 'newInstance');
    },
    enumerable: true,
    configurable: true
  }); // Add instance look up to the schema

  (0, _object_util.addProp)(schema, 'instance', {
    get: () => INSTANCE_CACHE[id],
    set: instance => {
      if (!instance) {
        clearInstance(id);
        (0, _lodash.default)(schema, 'instance');
      } else INSTANCE_CACHE[id] = instance;
    },
    enumerable: true,
    configurable: true
  });
  return INSTANCE_CACHE[id];
};
/**
 * Calls the render method of an instance and it's children when an Array or Object
 * @param { string } key - key tied to the instance through the schema
 * @param { any } value - value tied to the instance through the schema
 * @param { object } props - holder for the instance schema, editor settings, and full tree
 * @param { function } loopChildren - method to loop over the instance children
 * 
 * @returns { dom node } - the response from the instance render method
 */


exports.buildInstance = buildInstance;

const renderInstance = (key, value, props, loopChildren) => {
  const schema = props.schema,
        tree = props.tree,
        settings = props.settings;
  let domNode = (0, _jsutils.isObj)(value) ? (0, _jsutils.checkCall)(schema.instance.render, _objectSpread({}, props, {
    children: Object.entries(value).map(([childKey, child]) => buildChild(childKey, child, props, loopChildren))
  })) : Array.isArray(value) ? (0, _jsutils.checkCall)(schema.instance.render, _objectSpread({}, props, {
    children: value.map((child, index) => buildChild(index, child, props, loopChildren))
  })) : (0, _jsutils.checkCall)(schema.instance.render, props); // If a domNode was created, add it to it's schema by id
  // Ensure the domNode has an Id

  domNode && !domNode.id && (domNode.id = schema.id);
  return domNode;
};
/**
 * Calls the componentDidUpdate || componentDidMount methods of an instance based on the instance state
 * @param { object } tree - contains the entire source tree, idPosMap, and all schemas
 * @param { string } orgPos - original pos of the instance to update within the source tree
 * 
 * @returns { void }
 */


exports.renderInstance = renderInstance;

const callInstanceUpdates = (tree, orgPos) => Object.entries(tree.schema).map(([pos, schema]) => // Check if the update schema pos exists within the current schema pos
// This would mean the updated schema is a parent to the current schema
!schema.instance || schema.pos.indexOf(orgPos) !== 0 ? null : !schema.newInstance // If it's not a new instance, call the update method
? (0, _jsutils.isFunc)(schema.instance.componentDidUpdate) && schema.instance.componentDidUpdate({
  tree: tree,
  schema,
  parent: schema.parent
}) // Otherwise, set newInstance to false, and call the mounting method
: (schema.newInstance = false) || (0, _jsutils.isFunc)(schema.instance.componentDidMount) && schema.instance.componentDidMount({
  tree: tree,
  schema,
  parent: schema.parent
}));

exports.callInstanceUpdates = callInstanceUpdates;
const isTest = process.env.NODE_ENV === 'test';
isTest && (module.exports.setInstanceCache = cache => INSTANCE_CACHE = cache);