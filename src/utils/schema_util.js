import { buildTypeName } from './types_util'
import { isStr } from './string_util'
import { uuid, checkCall, isConstructor } from './methods_util'
import { checkMultiMatches } from './match_util'
import { upsertElement, removeElement } from './dom_util'
import { addProp } from './object_util'
import {
  buildInstance,
  buildInstancePos,
  callInstanceUpdates,
  clearInstanceCache,
  getInstanceCache,
  renderInstance,
} from './instance_util'
import _unset from 'lodash.unset'
import _get from 'lodash.get'
import { Schema } from 'jTConstants'

/**
 * Ensures the props object is not changed durring the render method of a Type
 * Helps to ensure props is only update through the editor
 * @param  { object } props - object passed to instance methods
 * @param  { object } check - props to check against
 *
 * @return { void }
 */
const checkPropsChange = (props, check) => (
  props && Object.keys(props).map(key => {
    if(props[key] !== check[key])
      throw new Error(`Props should not be changed when rendering a component!`)
    
    if(typeof props[key] === 'object' && Schema.PROPS_CHECK.indexOf(key) === -1)
      checkPropsChange(props[key], check[key])
  })
)

/**
 * Adds the component prop to the schema, as a getter / setter
 * Allows getting the dom node when called instead of caching it
 * Helps to prevent memory leaks 
 * @param  { object } schema - schema to start the loop process
 * @param  { string } id - dom node id connecting the schema and dom node
 *
 * @return { void }
 */
export const addSchemaComponent = (schema, id) => (
  addProp(schema, 'component', {
    get: () => (document.getElementById(id)),
    set: _id => {
      if(_id && _id !== id) id = _id
    },
    enumerable: true,
    configurable: true,
  })
)

/**
 * Rebuilds the schema for a value in the tree
 * Builds the instance from the Type based on the value
 * @param  { object } curSchema - schema to start the loop process
 * @param  { object } type - current type of the value
 * @param  { object } settings - config to for the tree data
 *
 * @return { object } - build schema object
 */
export const buildSchema = (curSchema, type, settings) => {
  const schema = {
    ...curSchema,
    pos: buildInstancePos(curSchema.key, curSchema.parent),
    id: curSchema.id || uuid(),
    keyType: curSchema.parent && Array.isArray(curSchema.parent.value)
      ? 'number' 
      : 'text',
    matchType: curSchema.matchType || buildTypeName(
      type.name || type.factory.name
    )
  }
  
  !schema.instance && buildInstance(
    type,
    schema,
    settings
  )

  return schema
}

/**
 * Loops over the curSchema. Updates it based on any changed values,
 * Calls the render method of the curSchemas type
 * @param  { object } curSchema - schema to start the loop process
 * @param  { object } tree - current tree data
 * @param  { object } settings - config to for the tree data
 * @param  { function } elementCb - callback to build the dom element
 *
 * @return { object || dom element } - tree if root element otherwise dom element
 */
export const loopSource = (curSchema, tree, settings, elementCb) => {
  const { value, key, parent, pos, pending, mode } = curSchema
  const Types = settings.Editor.Types
  const isRoot = key === Schema.ROOT
  const cutMode = mode === Schema.MODES.CUT

  // pending gets set when empty value is added, and the type was updated
  // This will switch it to edit mode, but the key and value will be empty
  // It also set the type when it was switched
  // So skip check the types here, so we don't override it
  const matchTypes = !cutMode && !pending && Types.getValueTypes(value, settings)

  // Get the type based on the found types, or the current type
  // If pending is set, but use the current type on the schema
  const type = pending
    ? !cutMode && Types.get(curSchema.matchType)
    : !cutMode && checkMultiMatches(matchTypes, curSchema, tree, settings)


  // Check if the type has a factory to call, if not just return
  if(cutMode || !type || !type.factory || !isConstructor(type.factory)){
    if(cutMode){
      curSchema.component = undefined
      curSchema.parent = undefined
      curSchema.id = undefined
    } 

    return isRoot ? tree : null
  }

  // Build an updated schema based on the new settings
  const schema = buildSchema(
    curSchema,
    type,
    settings
  )

  // If not the root element, set the parent to the schema
  !isRoot
    ? (schema.parent = parent)
    : (schema.isRoot = true)
  
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

  if(isRoot && !curSchema.id){
    props.schema.open = _get(settings, 'Editor.config.root.start') === 'open'
    props.schema.keyText = _get(settings, 'Editor.config.root.title', schema.key)
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
    addSchemaComponent(schema, component.id)
  
  // Add the dom components Id to the idMap
  // This will help with looking up the schema later
  tree.idMap[component && component.id || schema.id] = schema.pos

  // If we are not on the root element of the tree, 
  // Ensure the props get cleared out and return the rendered component
  if(!isRoot)
    return (props = undefined) || component
  
  // Only the root component should get to this point
  // Call the appendTree method to add the component tree to the dom
  elementCb && checkCall(
    elementCb,
    settings.Editor,
    component,
    settings.Editor.config.appendTree,
    tree
  )
  // Set component and props to undefined, to ensure it get's cleaned up
  // as it's longer being used
  component = undefined
  props = undefined

  // Then return the build tree
  return tree
}

/**
 * Checks if the settings.Editor.config.appendTree method exists, and calls it
 * If response is not false, it will add the rootComp the Dom
 * @param  { dom element } rootComp of the source data passed to the Editor
 * @param  { function } appendTree - from settings.Editor.config.appendTree (from user)
 *                                 - should always be bound to the Editor Class
 *
 * @return { void }
 */
export const appendTreeHelper = (jTree, rootComp, appendTree, tree) => {
  const res = checkCall(appendTree, rootComp, jTree, tree)
  if(res === false || !jTree.element) return null

  upsertElement(rootComp, jTree.element)
  const pos = tree.idMap[rootComp.id]
  callInstanceUpdates(tree, pos)
}

/**
 * Rebuilds the dom from a position in the tree
 * Only that pos and it's children are re-build
 * @param  { object } jTree - jTree editor object
 * @param  { string } pos - location to start rebuild from
 * @param  { object } settings - config to for the tree data
 *
 * @return { object || dom element } - tree if root element otherwise dom element
 */
export const buildFromPos = (jTree, pos, settings) => {
  if(!isStr(pos) || !jTree.tree.schema[pos])
    return logData(
      `Rebuild was called, but ${pos} does not exist it the tree`,
      jTree.tree,
      pos,
      'warn'
    )
  
  const renderSchema = jTree.tree.schema[pos]
  const updatedEl = loopSource(
    renderSchema,
    jTree.tree,
    settings,
    appendTreeHelper
  )
  
  // If updated element was not returned,
  // remove the current element from the dom
  if(updatedEl === null){
    const domNode = renderSchema.component
    return domNode && removeElement(domNode, domNode.parentNode)
  }
  // This method should not be called with the root schema
  // If it was, just return
  if(pos === Schema.ROOT || Boolean(updatedEl instanceof HTMLElement) === false)
    return

  // Adds the dom node to the tree
  upsertElement(updatedEl, renderSchema.component)
  // Calls the component life cycle methods
  callInstanceUpdates(jTree.tree, renderSchema.pos)
}