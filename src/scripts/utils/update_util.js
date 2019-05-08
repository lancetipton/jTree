import { isObj } from './object_util'
import { logData } from './methods_util'
import { clearSchema } from './clean_util'
import _get from 'lodash.get'
import _set from 'lodash.set'
import _unset from 'lodash.unset'

/**
 * Builds a new pos, by switching the pos for the key
 * Only works at a single level
 * @param  { string } pos - current tree node position
 * @param  { string } key - new tree node position
 * @return { string } updated tree node position
 */
const buildNewPos = (pos, key) => {
  const splitPos = pos.split('.')
  splitPos[splitPos.length -1] = key

  return splitPos.join('.')
}

/**
 * Updates the schema with the passed in update object
 * @param  { object } update - object containing updates to the schema
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */
export const updateSchema = (update, schema) => (
  isObj(update) && isObj(schema) && Object
    .entries(update)
    .reduce((updated, [ key, value ]) => {
      if(key === 'type') key = 'matchType'
      updated[key] = value

      return updated
    }, schema)
)

/**
 * Updates the matchType of the tree node at the passed in pos
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */
export const updateType = () => {
  
}

/**
 * Updates the value of the tree node at the passed in pos
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */
export const updateValue = (tree, pos) => _set(tree, pos, tree.schema[pos].value)

/**
 * Updates the position of an node in the tree
 * Updates the global tree object with the new position and schema
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { string } - updated position based on the new key
 */
export const updateKey = (tree, pos) => {
  // Cache the current value at that pos
  const currentVal = _get(tree, pos)
  // Get the new pos based on the update key and old pos
  const updatedPos = buildNewPos(pos, tree.schema[pos].key)
  // If the key was not actually changed, just return
  if(updatedPos === pos) return
  
  // Check if the updatedPos already exists. If it does, just return
  // Cause we don't want to overwrite it
  if(tree.schema[updatedPos])
    return logData(
      `Can not set position to '${updatedPos}', because it already exists!`,
      tree, 'warn'
    )

  // Remove the old value in the tree
  const unsetContent = _unset(tree, pos)
  if(!unsetContent)
    return logData(`Could not remove ${pos} from the tree`, tree, 'warn')
  
  // Set the new value in the tree
  _set(tree, updatedPos, currentVal)

  // Set the new schema data, with the new pos
  tree.schema[updatedPos] = {
    // Add the old pos data
    ...tree.schema[pos],
    // Overwrite the original pos with updated on
    value: currentVal,
    pos: updatedPos
  }

  clearSchema(tree.schema[pos], tree.schema, false)
  // return the updated pos
  return updatedPos
}