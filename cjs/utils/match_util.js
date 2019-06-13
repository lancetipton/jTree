"use strict";

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.entries");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkMultiMatches = exports.callMatchHelper = exports.getMatchTypes = void 0;

var _jsutils = require("jsutils");

var _constants = _interopRequireDefault(require("../constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 
 * @param  {any} matches 
 * @param  {any} priority 
 * @return 
 */
const setHighestPriority = (matches, priority) => {
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


const getMatchTypes = function getMatchTypes(TYPE_CACHE, value, parent, settings, matches = {}) {
  TYPE_CACHE[_constants.default.Values.MAP_TYPES]((name, meta) => {
    const factory = meta.factory; // Gets the priority from the factory class
    // Or the base priority if none exists for factory

    const priority = factory.priority || this.BaseType.constructor.priority; // Check and update the priority if needed

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

const callMatchHelper = (params, BaseType) => {
  const baseMatchHelper = BaseType.constructor.matchHelper;
  if (!params.matchTypes) return (0, _jsutils.checkCall)(baseMatchHelper, params);
  const parentFacts = [];
  let helperMethod;
  Object.entries(params.matchTypes).map(([typeName, meta]) => {
    if (!meta || !meta.factory || helperMethod) return;
    const matchHelper = meta.extends.factory.matchHelper;
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

const checkMultiMatches = (matchTypes, schema, tree, settings) => {
  let hasMatches = (0, _jsutils.isObj)(matchTypes);
  const matchKeys = hasMatches && Object.keys(matchTypes) || [];
  if (!matchKeys.length) hasMatches = false;
  const BaseType = settings.Editor.Types.BaseType,
        Editor = settings.Editor;
  const helperParams = {
    schema,
    tree,
    Editor // If no matches, then just call the match helper

  };
  if (!hasMatches) return callMatchHelper(helperParams, BaseType); // If only one matchType exists at this priority, just return it
  else if (matchKeys.length === 1) return matchTypes[matchKeys[0]]; // Otherwise set the matchTypes, and look for a matchHelper 

  helperParams.matchTypes = matchTypes;
  return callMatchHelper(helperParams, BaseType);
};

exports.checkMultiMatches = checkMultiMatches;