import { isObj } from './object_util'
import _get from 'lodash.get'
import _set from 'lodash.set'
import _unset from 'lodash.unset'

export const updateSchema = (update, schema) => (
  isObj(update) && isObj(schema) && Object
    .entries(update)
    .reduce((updated, [ key, value ]) => {
      if(key === 'type') key = 'matchType'
      updated[key] = value

      return updated
    }, schema)
)

export const updateType = () => {
  
}

export const updateValue = (tree, pos, schema) => _set(tree, pos, schema.value)

export const updateKey = (tree, pos, schema) => {
  const splitPos = pos.split('.')
  splitPos.pop()
  splitPos.push(schema.key)
  const updatedPos = splitPos.join('.')
  const currentVal = _get(tree, pos)

  // Remove the cold value in the tree
  const unsetContent = _unset(tree, pos)
  if(!unsetContent)
    return logData(`Could not remove ${pos} from the tree`, tree, 'warn')

  // Set the new value in the tree
  _set(tree, updatedPos, currentVal)
  
  // TODO: Remove the old schema
  // This needs to be cleaned up better
  // Should do clear object
  tree.schema[pos] = undefined
  delete tree.schema[pos]
  
  // Set the new schema data
  tree.schema[updatedPos] = {
    ...schema,
    pos: updatedPos
  }

  return { tree, updatedSchema: tree.schema[updatedPos] }
}