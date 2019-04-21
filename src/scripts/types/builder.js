import {
  buildSubTypes,
  checkCall,
  clearObj,
  cloneDeep,
  isFunc,
  isObj,
  logData,
  parseJSONString,
  isConstructor,
  validateBuildTypes,
  validateNewType,
} from '../utils'

const checkMultiMatches = (matchTypes, value, key, tree, parent, settings) => {
  const hasMatches = isObj(matchTypes)
  const matchKeys = hasMatches && Object.keys(matchTypes) || []
  if(!hasMatches || !matchKeys.length)
    return checkCall(
      settings.matchHelper, value, key, matchTypes, tree, parent, settings.Editor
    )

  const topPrioNum = matchKeys.pop()
  const topPrios = matchTypes[topPrioNum]
  const hasPrios = isObj(topPrios)
  const topPrioKeys = hasPrios && Object.keys(topPrios) || []
  // If only one type exists at this priority, just return it
  if(topPrioKeys.length === 1)
    return topPrios[topPrioKeys[0]]

  // Otherwise check if a matchHelper was passed in, and call it
  return checkCall(
    settings.matchHelper, value, key, matchTypes, tree, parent, settings.Editor
  )
}

const loopDataObj = (value, key, tree, parent, settings) => {
  const matchTypes = settings.Editor.Types.getTypes(value, settings)
  const type = checkMultiMatches(matchTypes, value, key, tree, parent, settings)
  if(!type || !type.match || !isFunc(type.match.build))
    return tree
  
  type.match.build(value, key, type.meta, tree, parent, settings)
  
  if(isObj(value))
    Object
      .entries(value)
      .map(([ key, data ]) => {
        loopDataObj(data, key, tree, value, settings)
      })
  else if(Array.isArray(value))
    value.map((data, index) => loopDataObj(data, index, tree, value, settings))

  return tree
}

export const buildTypes = (data, settings) => {
  if(!validateBuildTypes(data, settings.Editor)) return null
  
   const tree = { schema: {}, content: cloneDeep(data) }
  return loopDataObj(data, 'root', tree, tree, settings)

}