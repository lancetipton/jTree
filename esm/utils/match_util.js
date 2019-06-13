"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkMultiMatches = exports.callMatchHelper = exports.getMatchTypes = void 0;

var _jsutils = require("jsutils");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * 
 * @param  {any} matches 
 * @param  {any} priority 
 * @return 
 */
var setHighestPriority = function setHighestPriority(matches, priority) {
  if (!matches.highest || matches.highest <= priority) {
    matches.highest = priority;
    return true;
  }

  return false;
};
/**
 * 
 * @param  {any} TYPE_CACHE 
 * @param  {any} value 
 * @param  {any} parent 
 * @param  {any} settings 
 * @param  {any} [matches={}] 
 * @return 
 */


var getMatchTypes = function getMatchTypes(TYPE_CACHE, value, parent, settings) {
  var _this = this;

  var matches = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  TYPE_CACHE[_constants.default.Values.MAP_TYPES](function (name, meta) {
    var factory = meta.factory; // Gets the priority from the factory class
    // Or the base priority if none exists for factory

    var priority = factory.priority || _this.BaseType.constructor.priority; // Check and update the priority if needed

    try {
      // Check if the eval doesn't match, if no eval match, then return
      if (!factory || !factory.eval || !factory.eval(value)) return;
    } catch (e) {
      return;
    } // Need to only set highest prioirty if there is a match


    setHighestPriority(matches, priority); // Sets the meta to the matches object

    matches[priority] = matches[priority] || {};
    matches[priority][name] = meta;
  }, parent || TYPE_CACHE);

  return matches;
};
/**
 * Search for a the correct matchHelper based on the matches found
 *
 * @param  { object } params - object to pass to the matche helper
 * @param  { class instance } BaseType - Base Type Class instance
 * @param  { object } matches - Any found matches
 *
 * @return { object } result of matchHelper function
 */


exports.getMatchTypes = getMatchTypes;

var callMatchHelper = function callMatchHelper(params, BaseType) {
  var baseMatchHelper = BaseType.constructor.matchHelper;
  if (!params.matchTypes) return (0, _jsutils.checkCall)(baseMatchHelper, params);
  var parentFacts = [];
  var helperMethod;
  Object.entries(params.matchTypes).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        typeName = _ref2[0],
        meta = _ref2[1];

    if (!meta || !meta.factory || helperMethod) return;
    var matchHelper = meta.extends.factory.matchHelper;
    if (!matchHelper) return; // Check if parent meta already exists
    // If it already exits, we have double match, good enough

    if (matchHelper && parentFacts.indexOf(matchHelper) !== -1) helperMethod = meta.extends.factory.matchHelper; // If no exists in parentFacts, and has matchHelper, add it to parentFacts
    else if (matchHelper) parentFacts.push(matchHelper);
  }); // Ensure a helper method exists

  helperMethod = helperMethod || baseMatchHelper; // Call helper method

  return (0, _jsutils.checkCall)(baseMatchHelper, params);
};
/**
 * Searches found matches and determine the correct match to use
 * @param  {any} matchTypes - found types that match the value
 * @param  {any} value - current value being matched
 * @param  {any} key - object property ref to the value
 * @param  {any} tree - source of the data
 * @param  {any} parent - current values parent within the tree
 * @param  {any} settings - passed in user settings
 * @return { object } - found matchType
 */


exports.callMatchHelper = callMatchHelper;

var checkMultiMatches = function checkMultiMatches(matchTypes, schema, tree, settings) {
  var hasMatches = (0, _jsutils.isObj)(matchTypes);
  var matchKeys = hasMatches && Object.keys(matchTypes) || [];
  if (!matchKeys.length) hasMatches = false;
  var BaseType = settings.Editor.Types.BaseType,
      Editor = settings.Editor;
  var helperParams = {
    schema: schema,
    tree: tree,
    Editor: Editor // If no matches, then just call the match helper

  };
  if (!hasMatches) return callMatchHelper(helperParams, BaseType); // If only one matchType exists at this priority, just return it
  else if (matchKeys.length === 1) return matchTypes[matchKeys[0]]; // Otherwise set the matchTypes, and look for a matchHelper 

  helperParams.matchTypes = matchTypes;
  return callMatchHelper(helperParams, BaseType);
};

exports.checkMultiMatches = checkMultiMatches;