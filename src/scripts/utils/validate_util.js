import { isObj } from './object_util'
import { isConstructor, logData } from './methods_util'

export const validateNewType = (newType, TYPE_CACHE) => {
  if(!newType.name)
    return logData(`Type could not be registered. Types require a name property!`, 'error')
  if(TYPE_CACHE[newType.name])
    return logData(`Type with name ${newType.name} already registered!`, 'error')
  if(!isConstructor(newType))
    return logData(`New Types must be a constructor!`, 'error')

  return true
}

export const validateBuildTypes = (source, Editor) => {
  if(!validateSource(source)) return false

  if(!isObj(Editor.Types) || typeof Editor.Types.get !== 'function')
    return logData(`Editor.Types class is requires when building the editor types!`, 'error')
  
  return true
}

export const validateSource = (source) => {
if(!isObj(source))
  return logData(
    `Could update source. Please make sure source param is an Object or JSON parse-able string`,
    'error',
  )
  return true
}