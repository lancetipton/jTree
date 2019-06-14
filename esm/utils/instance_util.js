"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callInstanceUpdates = exports.renderInstance = exports.buildInstance = exports.clearInstance = exports.getInstanceCache = exports.clearInstanceCache = exports.buildInstancePos = void 0;

var _jsutils = require("jsutils");

var _types_util = require("./types_util");

var _clean_util = require("./clean_util");

var _object_util = require("./object_util");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INSTANCE_CACHE;
/**
 * Finds the child schema based on the passed in parent schema and key
 * @param { string } key - key to the child within the parent Object or Array 
 * @param { any } value - value to the child within the parent Object or Array 
 * @param { object } { tree, schema } - holder for the instance schema,  and full tree
 * 
 * @return { object } - found child schema
 */

var getChildSchema = function getChildSchema(key, value, _ref) {
  var tree = _ref.tree,
      schema = _ref.schema;
  return _objectSpread({}, tree.schema[buildInstancePos(key, schema)] || {}, {
    key: key,
    value: value,
    parent: schema
  });
};
/**
 * Builds an instance child schema when instance value is an Array or Object
 * @param {*} childKey - key tied to the instance through the schema
 * @param {*} child - value of the child to be built when parent is an Array or Object
 * @param {*} props - holder for the instance schema, editor settings, and full tree
 * @param { function } loopChildren - method to loop over the instance children
 * 
 * @return { any } - build child or undefined when child can not be built
 */


var buildChild = function buildChild(childKey, child, props, loopChildren) {
  if (props.schema.open) return loopChildren(getChildSchema(childKey, child, props), props.tree, props.settings);
  var childPos = buildInstancePos(childKey, props.schema);
  var schema = props.tree.schema[childPos];
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


var buildInstancePos = function buildInstancePos(key, parent) {
  return key === _constants.default.Schema.ROOT ? key : "".concat(parent.pos, ".").concat(key);
};
/**
 * Clears the INSTANCE_CACHE object of all instances 
 * 
 * @return { void }
 */


exports.buildInstancePos = buildInstancePos;

var clearInstanceCache = function clearInstanceCache() {
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

var getInstanceCache = function getInstanceCache(id) {
  return !id && INSTANCE_CACHE || INSTANCE_CACHE && INSTANCE_CACHE[id];
};
/**
 * Removes an instance from the instance cache
 * @param  { string } id - id of the instance to be removed
 * 
 * @return { boolean } - if the instance was removed
 */


exports.getInstanceCache = getInstanceCache;

var clearInstance = function clearInstance(id, instance) {
  instance = instance || INSTANCE_CACHE && INSTANCE_CACHE[id];
  if (!instance) return false;
  (0, _jsutils.isFunc)(instance.componentWillUnmount) && instance.componentWillUnmount();
  instance.state = undefined;
  instance.setState = undefined;
  (0, _jsutils.clearObj)(instance);
  id = id || INSTANCE_CACHE && Object.keys(INSTANCE_CACHE)[Object.values(INSTANCE_CACHE).indexOf(instance)];
  if (!id) return false;
  INSTANCE_CACHE[id] && (INSTANCE_CACHE[id] = undefined);
  (0, _jsutils.unset)(INSTANCE_CACHE, id);
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

var buildInstance = function buildInstance(type, schema, settings) {
  var id = schema.id,
      matchType = schema.matchType;
  INSTANCE_CACHE = INSTANCE_CACHE || {}; // Check for cached instance

  if (!INSTANCE_CACHE[id]) {
    // Get the config from the passed in settings
    var config = (0, _jsutils.get)(settings.types, "config.".concat(matchType)) || {};
    var editorConfig = settings.Editor.config || {}; // Add editor methods to the instance if none defined

    (0, _jsutils.mapObj)(_constants.default.Values.CUSTOM_EVENTS, function (key, value) {
      return !config[key] && editorConfig[key] && (config[key] = editorConfig[key]);
    }); // If no cached instance, built new one from factory

    var instance = new type.factory(config, settings.Editor); // Check for config overrides from the passed in settings

    config && (0, _types_util.typesOverride)(instance, config); // Wrap the methods on the instance, so we can pass the Editor into them when called

    Object.keys(instance).map(function (key) {
      if (!(0, _jsutils.isFunc)(instance[key])) return;
      var orgMethod = instance[key];

      instance[key] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        if (!_constants.default.Values.CUSTOM_EVENTS[key]) return orgMethod.apply(void 0, args.concat([settings.Editor]));
        var callOrg = false;
        var hasOverride = (0, _jsutils.isFunc)(editorConfig[key]);

        if (hasOverride) {
          var _settings$Editor$conf;

          if (editorConfig.eventOverride === 'instance') callOrg = true;else if ((_settings$Editor$conf = settings.Editor.config)[key].apply(_settings$Editor$conf, args.concat([settings.Editor])) !== false) callOrg = true;
        }

        if (!hasOverride || callOrg) return orgMethod.apply(void 0, args.concat([settings.Editor]));
      };
    }); // Add the instance to the instance cache

    INSTANCE_CACHE[id] = instance;
  } // Add the new instance prop


  var NEW_INSTANCE = true;
  (0, _object_util.addProp)(schema, 'newInstance', {
    get: function get() {
      return NEW_INSTANCE;
    },
    set: function set(update) {
      NEW_INSTANCE = undefined;
      (0, _jsutils.unset)(schema, 'newInstance');
    },
    enumerable: true,
    configurable: true
  }); // Add instance look up to the schema

  (0, _object_util.addProp)(schema, 'instance', {
    get: function get() {
      return INSTANCE_CACHE[id];
    },
    set: function set(instance) {
      if (!instance) {
        clearInstance(id);
        (0, _jsutils.unset)(schema, 'instance');
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

var renderInstance = function renderInstance(key, value, props, loopChildren) {
  var schema = props.schema,
      tree = props.tree,
      settings = props.settings;
  var domNode = (0, _jsutils.isObj)(value) ? (0, _jsutils.checkCall)(schema.instance.render, _objectSpread({}, props, {
    children: Object.entries(value).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          childKey = _ref3[0],
          child = _ref3[1];

      return buildChild(childKey, child, props, loopChildren);
    })
  })) : Array.isArray(value) ? (0, _jsutils.checkCall)(schema.instance.render, _objectSpread({}, props, {
    children: value.map(function (child, index) {
      return buildChild(index, child, props, loopChildren);
    })
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

var callInstanceUpdates = function callInstanceUpdates(tree, orgPos) {
  return Object.entries(tree.schema).map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        pos = _ref5[0],
        schema = _ref5[1];

    return (// Check if the update schema pos exists within the current schema pos
      // This would mean the updated schema is a parent to the current schema
      !schema.instance || schema.pos.indexOf(orgPos) !== 0 ? null : !schema.newInstance // If it's not a new instance, call the update method
      ? (0, _jsutils.isFunc)(schema.instance.componentDidUpdate) && schema.instance.componentDidUpdate({
        tree: tree,
        schema: schema,
        parent: schema.parent
      }) // Otherwise, set newInstance to false, and call the mounting method
      : (schema.newInstance = false) || (0, _jsutils.isFunc)(schema.instance.componentDidMount) && schema.instance.componentDidMount({
        tree: tree,
        schema: schema,
        parent: schema.parent
      })
    );
  });
};

exports.callInstanceUpdates = callInstanceUpdates;
var isTest = process.env.NODE_ENV === 'test';
isTest && (module.exports.setInstanceCache = function (cache) {
  return INSTANCE_CACHE = cache;
});