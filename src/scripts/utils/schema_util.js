import { buildTypeName } from './types_util'
import { uuid, checkCall, isConstructor } from './methods_util'
import { checkMultiMatches } from './match_util'
import {
  buildInstance,
  buildInstancePos,
  clearInstanceCache,
  getInstanceCache,
  renderInstance,
} from './instance_util'
import _unset from 'lodash.unset'
import { Schema } from 'jTConstants'

const checkPropsChange = (props, check) => (
  props && Object.keys(props).map(key => {
    if(props[key] !== check[key]) {
      throw new Error(`Props should not be changed when rendering a component!`)
    }
    
    if(typeof props[key] === 'object' && Schema.PROPS_CHECK.indexOf(key) === -1)
      checkPropsChange(props[key], check[key])
  })
)

const addCompProp = (schema, id) => {
  schema && Object.defineProperty(schema, 'component', {
    get: () => (document.getElementById(id)),
    set: _id => {
      if(_id && _id !== id) id = _id
    },
    enumerable: true,
    configurable: true,
  })

}

export const buildSchema = (curSchema, type, settings) => {
  const schema = {
    ...curSchema,
    pos: buildInstancePos(curSchema.key, curSchema.parent),
    id: curSchema.id || uuid(),
    matchType: curSchema.matchType || buildTypeName(
      type.name || type.factory.name
    )
  }
  !schema.instance && buildInstance(
    type,
    schema,
    settings
  )
  
  schema.key === Schema.ROOT && (schema.open = true)

  return schema
}

export const loopSource = (curSchema, tree, settings, elementCb) => {
  const { value, key, parent, pos, pending } = curSchema
  const Types = settings.Editor.Types

  // Get the matchTypes for the value
  // pending gets set when empty value is added, and the type was updated
  // This will switch it to edit mode, but the key and value will be empty
  // It also set the type when it was switched
  // So skip check the types here, so we don't override it
  const matchTypes = !pending && Types.getValueTypes(value, settings)

  // Get the type based on the found types, or the current type
  // If pending is set, but use the current type on the schema
  const type = pending
    ? Types.get(curSchema.matchType)
    : checkMultiMatches(matchTypes, curSchema, tree, settings)

  // Check if the type has a factory to call, if not just return
  if(!type || !type.factory || !isConstructor(type.factory))
    return tree
 
  // Build an updated schema based on the new settings
  const schema = buildSchema(
    curSchema,
    type,
    settings
  )

  // If not the root element, set the parent to the schema
  key !== Schema.ROOT && (schema.parent = parent)
  
  // If an old schema exists at this pos, clear it out
  // Add the schema to the tree based on pos
  tree.schema[schema.pos] = schema
  // Props helper to make it easier to manage
  let props = { schema, tree, settings }
  
  // Check if there is a shouldUpdate method, and is so call it
  const shouldUpdate = checkCall(
    schema.instance.shouldComponentUpdate, curSchema, props
  )

  if(shouldUpdate === false){
    // checkCall(schema.instance.componentWillUnmount, props, schema.component)
    // Should make instance a defined prop like component
    // Then in the getters and setters, have it update the instance cache
    schema.instance = undefined
    tree.idMap[schema.id] = schema.pos
    props = undefined
    return ''
  }

  // Render the component and it's children
  let component = renderInstance(
    key,
    value,
    props,
    loopSource
  )

  // Use the id to set the component prop on the schema
  component &&
    component.id &&
    addCompProp(schema, component.id)
  
  // Add the dom components Id to the idMap
  // This will help with looking up the schema later
  tree.idMap[component && component.id || schema.id] = schema.pos
  // If we are not on the root element of the tree, 
  // Ensure the props get cleared out and return the rendered component
  if(key !== Schema.ROOT)
    return (props = undefined) || component
  
  // Only the root component should get to this point
  // Call the appendTree method to add the component tree to the dom
  elementCb && checkCall(elementCb, component, settings.editor.appendTree, tree)
  // Set component and props to undefined, to ensure it get's cleaned up
  // as it's longer being used
  component = undefined
  props = undefined

  // Then return the build tree
  return tree
}