import { isObj } from './object_util'
import { logData, uuid } from './methods_util'
import { clearSchema } from './clean_util'
import { Schema } from 'jTConstants'
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
const buildNewPos = (pos, key, replace=true) => {
  const splitPos = pos.split('.')
  replace
    ? (splitPos[splitPos.length -1] = key)
    : splitPos.push(key)

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

const checkSchemaPos = (tree, pos) => (
  tree.schema[pos]
    ? logData(
      `Cannot add child to tree. Schema pos already exists!`,
      pos,
      tree.schema[pos],
      'error'
    )
    : true
)

export const addChildSchema = (tree, schema, parent) => {
  if(!tree || !isObj(schema) || !isObj(parent)) return
  const parentVal = _get(tree, parent.pos)
  if(!parentVal || typeof parentVal !== 'object') return
  
  
  schema.id = schema.id || uuid()
  
  if(tree.idMap[schema.id])
    return logData(
      `Can not add child to tree. Schema id already exists!`,
      schema.id,
      tree.schema[tree.idMap[schema.id]],
      'error'
    )

  schema.key = schema.key || schema.id
  schema.parent = parent
  if(schema.value === Schema.JT_EMPTY_TYPE)
    schema.key = Schema.JT_EMPTY_TYPE
  
  if(Array.isArray(parentVal)){
    schema.pos = buildNewPos(parent.pos, parentVal.length, false)
    if(!checkSchemaPos(tree, schema.pos)) return
    parentVal.push(schema.value)
  }
  else {
    schema.pos = schema.pos || buildNewPos(parent.pos, schema.key, false)
    if(!checkSchemaPos(tree, schema.pos)) return
    parentVal[schema.key] = schema.value || ''
  }

  tree.idMap[schema.id] = schema.pos
  tree.schema[schema.pos] = schema

  return true
}