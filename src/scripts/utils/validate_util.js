import { isObj } from './object_util'
import { isConstructor, logData } from './methods_util'
import { Values, Schema } from '../constants'
import _get from 'lodash.get'
import _unset from 'lodash.unset'

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
 * @return { boolean }
 */
export const validateUpdate = (idOrPos, update, tree) => {
  const { prop, value } = update
  
  if(!idOrPos)
    return logData(
      `Update requires an id or position as it's first argument!`,
      idOrPos, tree, 'warn'
    )

  // Get the pos to be updated
  const pos =  tree.idMap[idOrPos] || idOrPos

  // Check if the pos exists,
  if(!pos || !tree.schema[pos])
    return logData(
      `Could not find position with ${idOrPos}. Are you sure it exists in the tree!`,
      tree, 'warn'
    )

  // Get the current data in the tree, and the current schema
  const schema = tree.schema[pos]
  const isEmptyType = schema.matchType === Schema.EMPTY
  //  Check if data in the tree, or if it was an empty type
  if(!schema && !isEmptyType)
    return logData(
      `Could not find any data in the tree that matches ${idOrPos}!`,
      tree, 'warn'
    )
  
  // Check if the update is an object
  if(!isObj(update))
    return logData(
      `Update method second argument must be an object!`,
      update, tree, 'warn'
    )
  
  if(update.mode === Schema.MODES.REMOVE)
    return { schema, pos }
  
  // Ensure the key is updated when dealing with an empty object
  // Check If key is empty type, and if this is a matchType update
  // If key is empty type, then we should be updating the matchType
  if(schema.mode === Schema.MODES.ADD && !update.matchType)
    return logData(
      `A valid type is required to update the item!`,
      update, tree, schema, 'warn'
    )

  // Validate the update properties, to ensure we only update what is allowed
  const nonValid = Object
    .keys(update)
    .reduce((notValid, key) => {
      if(Schema.TREE_UPDATE_PROPS.indexOf(key) == -1 )
        notValid = key
      
      return notValid
    }, false)
  
  // If no valid update props, log and return
  if(nonValid)
    return logData(`${nonValid} is not a valid update property`, update, tree, 'warn')

  return { schema, pos }
}


export const validateAdd = (schema, parent) => {
  return !isObj(schema)
    ? logData(`Add method requires a valid schema object as the first argument`, 'error')
    : !isObj(parent) || !parent.value || !parent.pos
      ? logData(`Add method requires a valid parent schema`, 'error')
      : typeof parent.value !== 'object'
        ? logData(`Parent value must equal type 'object' ( Object || Array )`, 'error')
        : true
}
