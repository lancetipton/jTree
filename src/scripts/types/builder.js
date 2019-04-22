import {
  buildTypeName,
  checkCall,
  clearObj,
  isFunc,
  isObj,
  logData,
  parseJSONString,
  isConstructor,
  validateBuildTypes,
  validateNewType,
  uuid,
} from '../utils'

let INSTANCE_CACHE = {}
export const clearInstanceCache = () => {
  clearObj(INSTANCE_CACHE)
  INSTANCE_CACHE = {}
}
const buildInstance = (type, typeName, settings) => {
  INSTANCE_CACHE[typeName] = INSTANCE_CACHE[typeName] || 
    new type.factory(settings.types[typeName])
  return INSTANCE_CACHE[typeName]
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
const callMatchHelper = (params, BaseType) => {
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

const checkMultiMatches = (matchTypes, value, key, tree, parent, settings) => {

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


const buildPos = (key, parent) => (
  key === 'root'
    ? key
    : `${parent.schema.pos}.${key}`
)

const loopDataObj = (value, key, tree, parent, settings) => {
  const matchTypes = settings.Editor.Types.getTypes(value, settings)  
  const type = checkMultiMatches(matchTypes, value, key, tree, parent, settings)

  // Check if the type has a factory to call, if not just return
  if(!type || !type.factory || !isConstructor(type.factory))
    return tree

  const typeName = buildTypeName(type.name || type.factory.name)
  const instance = buildInstance(type, typeName, settings)
  const schema = {
    key,
    id: uuid(),
    instance,
    matchType: typeName,
    pos: buildPos(key, parent),
  }
  if(key !== 'root')
    schema.parent = parent.schema

  tree.schema[schema.id] = schema
  const props = {
    value,
    key,
    type,
    tree,
    schema,
    parent,
    settings
  }

  const built = isFunc(instance.build) && instance.build(props)
  if(built) props.schema.built = built

  // Only render if built is not equal to false
  // Allows bypassing the render it it does not need to be rendered
  if(built !== false){
    const component = isFunc(type.render) && new type.render(props)
    if(component){
      props.schema.component = component
      isFunc(props.schema.component.render) && props.schema.component.render(props)
    }
  }

  const parentData = { schema, value }
  
  if(isObj(value))
    Object
      .entries(value)
      .map(([ childKey, data ]) => {
        loopDataObj(data, childKey, tree, parentData, settings)
      })
  else if(Array.isArray(value))
    value.map((data, index) => {
      loopDataObj(data, index, tree, parentData, settings)
    })

  return tree
}

export const buildTypes = (source, settings) => {
  if(!validateBuildTypes(source, settings.Editor)) return null
  
  const tree = { schema: {}, content: source }

  return loopDataObj(source, 'root', tree, { value: tree }, settings)
}