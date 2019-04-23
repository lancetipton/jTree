import { checkCall } from './methods_util'
import { isObj } from './object_util'
import { Values } from '../constants'

export const getMatchTypes = function(TYPE_CACHE, value, parent, settings, matches={}){
  TYPE_CACHE.children[Values.MAP_TYPES]((name, meta) => {
    const { factory } = meta
    // Check if there is a match to the value
    if(!factory || !factory.eval || !factory.eval(value)) return
    // Gets the priority from the factory class
    // Or the base priority if none exists for factory
    const priority = factory.priority || this.BaseType.constructor.priority
    // Sets the meta to the matches object
    matches[priority] = matches[priority] || {}
    matches[priority][name] = meta

    // Check If the type have children, nad check them as well
    if(isObj(meta.children))
      getMatchTypes.apply(this, [ TYPE_CACHE, value, meta.children, settings, matches])

  }, parent || TYPE_CACHE.children)
  
  return matches
}

/**
 * Search for a the correct matchHelper based on the matches found
 *
 * @param  { object } params - object to pass to the matche helper
 * @param  { class instance } BaseType - Base Type Class instance
 * @param  { object } matches - Any found matches
 *
 * @return { object } result of matchHelper function
 */
export const callMatchHelper = (params, BaseType) => {
  const baseMatchHelper = BaseType.constructor.matchHelper
  if(!params.matchTypes)
    return checkCall(baseMatchHelper, params)

  const parentFacts = []
  let helperMethod
  Object
    .entries(params.matchTypes)
    .map(([ typeName, meta ]) => {
      if(!meta || !meta.factory || helperMethod) return
      const { extends: { factory: { matchHelper } } } = meta
      if(!matchHelper) return

      // Check if parent meta already exists
        // If it already exits, we have double match, good enough
      if(matchHelper && parentFacts.indexOf(matchHelper) !== -1)
        helperMethod = meta.extends.factory.matchHelper
      // If no exists in parentFacts, and has matchHelper, add it to parentFacts
      else if (matchHelper)
        parentFacts.push(matchHelper)
    })

  // Ensure a helper method exists
  helperMethod = helperMethod || baseMatchHelper
  // Call helper method
  return checkCall(baseMatchHelper, params)
}

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
export const checkMultiMatches = (matchTypes, value, key, tree, parent, settings) => {

  let hasMatches = isObj(matchTypes)
  const matchKeys = hasMatches && Object.keys(matchTypes) || []
  if(!matchKeys.length) hasMatches = false

  const { Editor: { Types: { BaseType } }, Editor } = settings
  
  const helperParams = {
    value,
    key,
    tree,
    parent,
    Editor
  }

  // If no matches, then just call the match helper
  if(!hasMatches)
    return callMatchHelper(helperParams, BaseType)
  // If only one matchType exists at this priority, just return it
  else if(matchKeys.length === 1)
    return matchTypes[matchKeys[0]]

  // Otherwise set the matchTypes, and look for a matchHelper 
  helperParams.matchTypes = matchTypes
  return callMatchHelper(helperParams, BaseType)
}