import {
  isObj,
  logData,
  uuid,
  isFunc,
  checkCall
} from 'jsUtils'

import { clearSchema } from './clean_util'
import { clearInstance, buildInstance } from './instance_util'
import Constants from 'jTConstants'
import _get from 'lodash.get'
import _set from 'lodash.set'
import _unset from 'lodash.unset'

/**
 * Checks if the schemas current value matches any allowed types for the new type
 * The newType must have a static prop allowEmptyValue
 * Which can be any of
 *       * Array - [ check if the value matches any values in the array ]
 *       * Object - [ check if the value is an empty object ]
 *       * true - [ match the value to empty object || array || string || 0 ]
 * @param  {any} newType - Object built by the types util ( requires newType.factory )
 * @param  {any} schema - Current schema of the item being checked
 * @return boolean of if the value is an equal value for the type
 */
const checkEmptyType = (newType, schema) => {
  const { allowEmptyValue } = newType.factory
  if(allowEmptyValue === undefined) return false
  
  // If exact match, just return true
  if(schema.value === allowEmptyValue) return true

  const valIsObj = typeof schema.value === 'object'
  const valIsEmptyObj = valIsObj && Object.keys(schema.value).length === 0
  // Check allow empty is true
  // Then check the types, and use that to check if it's empty
  if(allowEmptyValue === true)
    return valIsObj
      ? valIsEmptyObj
      : schema.value === 0 || schema.value === ''
  
  // Cache so vars for easy lookup
  const allowType = typeof allowEmptyValue
  const allowIsObj = allowType === 'object'
  const allowArr = allowIsObj && Array.isArray(allowEmptyValue)

  // If the type if an array, then loop over the array, and see if any match 
  // the current value
  if(allowArr)
    return allowEmptyValue
      .reduce((hasEmpty, allowedEmpty) => {
        return hasEmpty
          ? hasEmpty
          : (allowIsObj && valIsEmptyObj) || schema.value === allowedEmpty
      })

  // If it's an object, but not array
  return allowIsObj && typeof valIsEmptyObj  
}

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
 * Checks if the passed in pos already exists in the tree
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - location in the tree to check
 */
const checkSchemaPos = (tree, pos, checkExists) => (
  checkExists
    ? !tree.schema[pos]
      ? logData(
        `Cannot update schema in tree. Schema does not exist!`,
        pos,
        tree.schema[pos],
        'error'
      )
      : true
    : tree.schema[pos]
      ? logData(
        `Cannot add child to tree. Schema pos already exists!`,
        pos,
        tree.schema[pos],
        'error'
      )
      : true
)

/**
 * Updates the error field on a schema
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { object } schema - current schema being updated
 * @param { object } settings - current settings of the Editor
 * @param { string } prop - prop on the schema where the error occured
 * @param { any } value - current value of the schema
 * @param { string } message - Error message
 * 
 * @return { void }
 */
export const updateSchemaError = (tree, schema, settings, prop, value, message) => {
  schema.error = checkCall(
    schema.instance.constructor.error,
    {
      prop,
      value,
      message,
      schema,
      tree,
      settings,
    }
  )
}

/**
 * Updates the schema with the passed in update object
 * @param  { object } update - object containing updates to the schema
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */
export const updateSchema = (update, schema) => {
  return isObj(update) && isObj(schema) && Object
    .entries(update)
    .reduce((updated, [ key, value ]) => {
      if(key === 'type') key = 'matchType'
      updated[key] = value
      
      return updated
    }, schema)
}

/**
 * Updates the matchType of the tree node at the passed in pos
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */
export const updateType = (tree, pos, schema, settings) => {
  if(!pos || !isObj(schema))
    return { error: `The pos and schema are required to update schema type` }

  // Ensure the passed in pos exists in the tree
  if(!checkSchemaPos(tree, pos, true)) return
  
  // Remove the old instance
  clearInstance(schema.id)
  _unset(schema, 'instance')

  // Get the type to switch to
  const newType = settings.Editor.Types.get(schema.matchType)
  if(!newType)
    return { error: `Type '${schema.matchType}' in not a configured type` }

  let hasValue = schema.value || schema.value === 0 || schema.value === ''

  if(!hasValue && isFunc(newType.factory.defaultValue))
    schema.value = newType.factory.defaultValue(schema, settings)
  
  // Check if it has a value
  hasValue = schema.value || schema.value === 0 || schema.value === ''
  // Check if the value is an empty type
  const hasEmpty = checkEmptyType(newType, schema)

  // If we have a value and it's not an empty type, then run an eval check on it
  // If it fails, set the error on the schema. The Types determine how to handel it
  if( hasValue && (!hasEmpty && !newType.factory.eval(schema.value)) )
    return {
      error: `'Not a valid value for ${(newType.factory.name || '').replace('Type', '')}`
    }
  
  // If there's a value, and no error, then set it in the tree
  if(hasValue && !schema.error)
    _set(tree, schema.pos, schema.value)
  
  tree.schema[pos] = {
    ...schema,
    pending: true,
    instance: buildInstance(newType, schema, settings),
    mode: Constants.Schema.MODES.EDIT,
  }
}

/**
 * Updates the value of the tree node at the passed in pos
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { void }
 */
export const updateValue = (tree, pos, schema, settings) => {
  // Get ref to the constructor from the tree, it does not exist in the 
  // current schema copy
  const factory = tree.schema[pos].instance.constructor
  if('value' in schema && !factory.eval(schema.value))
    return { error: `Not a valid value for ${(factory.name || '').replace('Type', '')}` }

  _set(tree, pos, schema.value)
  _set(tree.schema[pos], 'value', schema.value)
}

/**
 * Updates the position of an node in the tree
 * Updates the global tree object with the new position and schema
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { string } - updated position based on the new key
 */
export const updateKey = (tree, pos, schema, settings) => {
  if(!schema.key)
    return { error: `Can not set key to a falsy value!` }
    
  // Cache the current value at that pos
  const currentVal = _get(tree, pos)
  // Get the new pos based on the update key and old pos
  const updatedPos = buildNewPos(pos, schema.key)
  
  
  // If the key was not actually changed, just return
  if(updatedPos === pos) return
  
  // Check if the updatedPos already exists. If it does, just return
  // Cause we don't want to overwrite it
  if(tree.schema[updatedPos])
    return { error: `Can not update key ${schema.key}, because it already exists!` }

  // Remove the old value in the tree
  const unsetContent = _unset(tree, pos)
  if(!unsetContent)
    return { error: `Could not update key, because ${pos} could not be removed!` }

  // Set the new value in the tree
  _set(tree, updatedPos, currentVal)

  // Set the new schema data, with the new pos
  tree.schema[updatedPos] = {
    ...tree.schema[pos],
    // Add the old pos data
    ...schema,
    // Overwrite the original pos with updated on
    value: currentVal,
    pos: updatedPos
  }

  clearSchema(tree.schema[pos], tree, false)
  // return the updated pos
  return { pos: updatedPos }
}

/**
 * Updates schema.open prop of the node in the tree, to the passed in prop
 * Updates the global tree object with the new position and schema
 * @param  { object } tree - object containing the entire jTree object structure 
 * @param  { string } pos - string position in the tree
 * @param  { object } schema - data that defines the object at the current pos
 * @return { string } - updated position based on the new key
 */
export const updateSchemaProp = (tree, pos, schema, settings, prop) => {
  if(prop in schema) tree.schema[pos][prop] = schema[prop]
}

/**
 * Adds a child schema to parent schema or tree
 * @param  {any} tree - full source and schema of entire data
 * @param  {any} schema - new schema to add
 * @param  {any} parent - parent schema to add child schema to
 * @return  { boolean } - true if schema is added to the parent
 */
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
  
  if(Array.isArray(parentVal)){
    schema.pos = buildNewPos(parent.pos, parentVal.length, false)
    if(!checkSchemaPos(tree, schema.pos)) return
    parentVal.push(schema.value)
  }
  else {
    schema.pos = schema.pos || buildNewPos(parent.pos, schema.key, false)
    if(!checkSchemaPos(tree, schema.pos)) return
    parentVal[schema.key] = schema.value
  }

  tree.idMap[schema.id] = schema.pos
  tree.schema[schema.pos] = schema

  return true
}

/**
 * Adds a child schema to parent schema or tree
 * @param  {any} tree - full source and schema of entire data
 * @param  {any} schema - new schema to add
 * @param  {any} parent - parent schema to add child schema to
 * @return  { boolean } - true if schema is added to the parent
 */
export const addRemoveSchema = (add, remove, tree) => {
  if(!tree) return null

  if(remove && remove.pos)
    clearSchema(remove, tree, add && remove.instance !== add.instance)

  if(add){
    if(!add.pos)
      return { error: `Can not add to schema, position is required!`, key: 'pos' }
    else if(!add.id)
      return { error: `Can not add to schema, id is required!`, key: 'id' }
      
    // Set in tree
    add.value && _set(tree, add.pos, add.value)
    // Set in idMap
    add.id && (tree.idMap[add.id] = add.pos)
    // Set in schema
    tree.schema[add.pos] = add
  }

}