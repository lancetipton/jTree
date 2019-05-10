import { isObj } from './object_util'
import { isConstructor, logData } from './methods_util'
import { Values, Schema } from '../constants'
import _get from 'lodash.get'

/**
 * Validates a new type to ensure if has not already been registered
 * @param  { object } newType - new object to be validated
 * @param  { Object } TYPE_CACHE - stores currently registered type classes
 * @return { boolean }
 */
export const validateNewType = (newType, TYPE_CACHE) => {
  if(!newType.name)
    return logData(`Type could not be registered. Types require a name property!`, 'error')
  if(TYPE_CACHE[newType.name])
    return logData(`Type with name ${newType.name} already registered!`, 'error')
  if(!isConstructor(newType))
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
  const pos =  tree.idMap[idOrPos] || idOrPos
  if(!pos)
    return logData(
      `Could not find position with ${idOrPos}. Are you sure it exists in the tree!`,
      tree, 'warn'
    )

  const dataInTree = _get(tree, pos, Schema.NOT_IN_TREE)
  if(dataInTree === Schema.NOT_IN_TREE) {
    return logData(
      `Could not find any data in the tree that matches ${idOrPos}!`,
      tree, 'warn'
    )
  }
  
  if(!isObj(update))
    return logData(
      `Update method second argument must be an object!`,
      update, tree, 'warn'
    )
  
  const schema = tree.schema[pos]
  const nonValid = Object
    .keys(update)
    .reduce((notValid, key) => {
      if(Schema.TREE_UPDATE_PROPS.indexOf(key) == -1 )
        notValid = key
      
      return notValid
    }, false)
  
  if(nonValid)
    return logData(`${nonValid} is not a valid update property`, 'warn')
  

  
  return { schema, pos }
}


export const validateAdd = (schema, parent) => (
  !isObj(schema) || !schema.key
    ? logData(`Add method requires a valid schema object as the first argument`, 'error')
    : !isObj(parent) || !parent.value || !parent.pos
      ? logData(`Add method requires a valid parent schema`, 'error')
      : typeof parent.value !== 'object'
        ? logData(`Parent value must equal typeof 'object' ( Object || Array )`, 'error')
        : true
)