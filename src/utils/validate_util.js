import { isObj, logData } from 'jsUtils'
import { isConstructor } from './methods_util'
import { Values, Schema } from '../constants'
import _get from 'lodash.get'
import _unset from 'lodash.unset'

/**
 * Validates a key in the context of an Array
 * Array keys must be an index in the array, or the same as array length
 * @param  { string } key - index to be validated
 * @param  { array } parentVal - array the key is validated against
 * @param  { object } schema - data about the key in the parentVal
 *
 * @return { object } contains error data if one exists
 */
const validateKeyInArray = (key, parentVal, schema) => {
  let invalid
  const index = parseInt(key)
  if(!isNaN(index)) {
    const parKeys = Object.keys(parentVal)
    invalid = (parKeys.indexOf(index) === -1 && parKeys.length !== index)
  }
  else invalid = true
  // Array keys must be an index
  // Check if in the current array of index
  // or it's equal to the length, so it's being added as the next node, 
  return invalid
    ? { error: `Key '${key}'' must be a numbered index for Type ${schema.instance.name}!`}
    : { error: false }
}

/**
 * Validates a new type to ensure if has not already been registered
 * @param  { object } newType - new object to be validated
 * @param  { Object } TYPE_CACHE - stores currently registered type classes
 * @return { boolean }
 */
export const validateMatchType = (checkType, TYPE_CACHE) => {
  const failedClsProps = Schema.TYPE_CLASS_CHECK
    .reduce((failedCheck, prop) => {
      !(checkType.hasOwnProperty(prop)) && failedCheck.push(prop)
      return failedCheck
    }, [])
  
  if(failedClsProps.length)
      return logData(
        `Could not register type '${checkType.name || 'Type'}'. It's missing these static properties:\n\t${failedClsProps.join('\n\t')}`,
        'error'
      )

  if(TYPE_CACHE && TYPE_CACHE[checkType.name])
    return logData(`Type with name ${checkType.name} is already registered!`, 'error')
  if(!isConstructor(checkType))
    return logData(`New Types must be a constructor!`, 'error')

  return true
}

/**
 * Ensures the Editor types class is loaded
 * @param  { object } source 
 * @param  { Editor Class } Editor 
 * @return { boolean }
 */
export const validateBuildTypes = (source, Editor) => {
  if(!validateSource(source)) return false

  if(!isObj(Editor.Types) || typeof Editor.Types.get !== 'function')
    return logData(`Editor.Types class is required when building the editor types!`, 'error')
  
  return true
}

/**
 * Ensures the passed in source is an object
 * @param  { object } source 
 * @return { boolean }
 */
export const validateSource = (source) => {
  if(!isObj(source))
    return logData(
      `Could update source. Please make sure source param is an Object or JSON parse-able string`,
      'error'
    )
  return true
}

/**
 * Validate the passed in params to ensure proper data is used whe updating the tree schema
 * @param  { string } idOrPos - location of the value to be updated
 * @param  { object } update - describes what should be update
 * @param  { object } tree - holds the source and schema for of the active object
 *
 * @return { object } contains error data if one exists
 */
export const validateUpdate = (tree, idOrPos, update, settings) => {
  let res = {}
  if(!idOrPos)
    return { error: `Update requires an id or position!` }

  // Get the pos to be updated
  const pos =  tree.idMap[idOrPos] || idOrPos

  // Check if the pos exists,
  if(!pos || !tree.schema[pos])
    return { error: `Could not find position ${idOrPos} in the tree!` }

  // Get the current data in the tree, and the current schema
  const schema = tree.schema[pos]
  const isEmptyType = schema.matchType === Schema.EMPTY
  //  Check if data in the tree, or if it was an empty type
  if(!schema && !isEmptyType)
    return { error: `Could not find node in tree that matches ${idOrPos}!` }
  
  // Check if the update is an object
  if(!isObj(update))
    { error: `Update method third argument must be an object!`}
  
  // Finished validating for REMOVE and REPLACE updates
  if(update.mode === Schema.MODES.REMOVE || update.mode === Schema.MODES.REPLACE)
    return { schema, pos }
  
  // Check if in add more, but no match type exists
  // If adding a node to the tree, we must know what type it should be
  if(schema.mode === Schema.MODES.ADD && !update.matchType)
    return { error: `A valid type is required to update the item!`}

  // Validate the update properties, to ensure we only update what is allowed
  const nonValid = Object
    .keys(update)
    .reduce((notValid, prop) => {
      if(Schema.TREE_UPDATE_PROPS.indexOf(prop) == -1 )
        notValid = prop
      
      return notValid
    }, false)
  
  // If no valid update props, log and return
  if(nonValid)
    return { error: `${nonValid} is not a valid update property` }

  return { schema, pos }
}

/**
 * Validates adding new schema to a parent node to ensure it has correct data
 *
 * @param  { object } schema - schema to add to the parent
 * @param  { object } parent - schema object to add the child schema to
 *
 * @return { object } contains error data if one exists
 */
export const validateAdd = (schema, parent) => {
  return !isObj(schema)
    ? { error: `Add method requires a valid schema object as the first argument` }
    : !isObj(parent) || !parent.value || !parent.pos
      ? { error: `Add method requires a valid parent schema` }
      : typeof parent.value !== 'object'
        ? { error: `Parent value must equal type 'object' ( Object || Array )` }
        : { error: false }
}

/**
 * Validates a new key for a value as a position in the tree
 *
 * @param  { string || number } key - key to be validated
 * @param  { object } tree - holds the source and schema for of the active object
 * @param  { string } pos - location of the value to be updated
 * @param  { object } schema - data about the value found at the passed in pos
 *
 * @return { object } contains error data if one exists
 */
export const validateKey = (key, tree, pos, schema) => {
  if(!key && key !== 0)
    return { error: `Can not set key to a falsy value!` }

  if(!tree.schema[pos])
    return  { error: `Position '${pos}' does not exist, can not update key!` }

  const parentVal = schema.parent.value
  if(Array.isArray(parentVal))
    return validateKeyInArray(key, parentVal, schema)
  
  const noString = `Invalid key value: ${key}. Could not convert ${key} into a string!`
  try {
    return { error: typeof key.toString() === 'string' ? false  : noString }
  }
  catch(e){
    return { error: noString } 
  }

}