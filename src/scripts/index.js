'use strict';

import {
  addChildSchema,
  buildSettings,
  callInstanceUpdates,
  checkCall,
  cleanUp,
  clearObj,
  clearSchema,
  cloneDeep,
  deepMerge,
  getElement,
  isFunc,
  isObj,
  isStr,
  logData,
  parseJSONString,
  removeElement,
  setLogs,
  updateKey,
  updateSchema,
  updateSchemaError,
  updateType,
  updateValue,
  upsertElement,
  validateAdd,
  validateKey,
  validateSource,
  validateUpdate,
  loopSource,
} from 'jTUtils'
import { Values, Schema, EditorConfig } from 'jTConstants'
import { buildTypes, TypesCls } from './types'
import _get from 'lodash.get'
import _set from 'lodash.set'
import _unset from 'lodash.unset'

import { DEF_SETTINGS } from './constants'

const UPDATE_ACTIONS = {
  matchType: updateType,
  value: updateValue,
}

// Cache holder for active source data
let ACT_SOURCE

/**
 * Checks if the settings.Editor.config.appendTree method exists, and calls it
 * If response is not false, it will add the rootComp the Dom
 * @param  { dom element } rootComp of the source data passed to the Editor
 * @param  { function } appendTree - from settings.Editor.config.appendTree ( from user )
 *                                 - should always be bound to the Editor Class
 *
 * @return { void }
 */
const appendTreeHelper = function(rootComp, appendTree, tree){
  const res = checkCall(appendTree, rootComp, this, tree)
  if(res === false || !this.element) return null
  upsertElement(rootComp, this.element)
  const pos = tree.idMap[rootComp.id]
  callInstanceUpdates(tree, pos)
}

const buildFromPos = (jTree, pos, settings, force) => {
  if(!isStr(pos) || !jTree.tree.schema[pos]) return
  
  const renderSchema = jTree.tree.schema[pos]
  const valueInTree = _get(jTree.tree, pos)  
  const updatedEl = loopSource(
    renderSchema,
    jTree.tree,
    settings,
    appendTreeHelper && appendTreeHelper.bind(jTree)
  )
  // This method should not be called by the schema root element
  // If it was, but return
  if(pos === Schema.ROOT) return

  // Adds the dom node to the tree
  upsertElement(updatedEl, renderSchema.component)
  // Calls the component life cycle methods
  callInstanceUpdates(jTree.tree, renderSchema.pos)
}

// Must be bound to the jTree editor when called
const handelUpdateError = (jTree, pos, settings, prop, value, message) => {
  if(!pos || !jTree.tree.schema[pos])
    return logData(`Could not find ${pos} in the tree!`)

  // Update the schema for the node with the error
  updateSchemaError(
    jTree.tree,
    jTree.tree.schema[pos],
    settings,
    prop,
    value,
    message
  )
  // Re-render the tree from this pos, so the error is shown
  buildFromPos(jTree, pos, settings)
}

const doKeyUpdate = (jTree, update, pos, schema, settings) => {
  const valid = validateKey(update.key, jTree.tree, pos, schema)
  // If the key is not valid, then update the schema error
  if(!valid || valid.error)
    return handelUpdateError(
      jTree,
      pos,
      settings,
      'key',
      update.key,
      valid.error
    )

  const updated = updateKey(jTree.tree, pos, schema, settings)
  if(!updated || updated.error)
    return handelUpdateError(
      jTree,
      pos,
      settings,
      'key',
      update.key,
      updated.error
    )

  return updated.pos
}

const doUpdateData = (jTree, update, pos, schema, settings) => {
  let invalid
  // Loop over the allowed props to be update
  Schema.TREE_UPDATE_PROPS
    .map(prop => {
      // Only keep doing update when no error exists
      if(invalid) return

      // If the prop exists in the update actions,
      // and the passed in update object
      // Then call the action to update it
      invalid = update[prop] && 
        checkCall(UPDATE_ACTIONS[prop], jTree.tree, pos, schema, settings)
      
      if(!invalid) return
        invalid.prop = prop
        invalid.value = update[prop]
    })

  return invalid && invalid.error
    ? handelUpdateError(
      jTree,
      pos,
      settings,
      invalid.prop,
      invalid.value,
      invalid.error
    )
    : true
}


const createEditor = (settings, editorConfig, domContainer) => {

  class jTree {
    
    constructor(){
      return TypesCls(settings)
        .then(Types => {
          this.Types = Types
          this.element = domContainer
          this.element.classList.add(Values.ROOT_CLASS)
          const { source, ...config } = editorConfig
          this.config = config
          settings.Editor = this
          return source && this.setSource(source, true)
        })
    }

    buildTypes = source => {
      if(source && source !== ACT_SOURCE)
        return this.setSource(source)
      
      if(!isObj(ACT_SOURCE))
        return logData(`Could build types, source data is invalid!`, ACT_SOURCE, 'warn')
      
      if(isObj(ACT_SOURCE))
        this.tree = buildTypes(ACT_SOURCE, settings, appendTreeHelper.bind(this))

        return this
    }

    setSource = (source, update) => {
      if(typeof source === 'string')
        source = parseJSONString(source)

      if(!validateSource(source)) return undefined

      ACT_SOURCE = cloneDeep(source)
      return update && this.buildTypes()
    }
    
    forceUpdate = pos => {
      pos && buildFromPos(this, pos, settings, true)
    }

    update = (idOrPos, update) => {
      
      let pos = this.tree.idMap[idOrPos] || idOrPos
      // Ensure the passed in update object is valid
      const validData = validateUpdate(this.tree, idOrPos, update, settings)
      // And Ensure we have a schema, pos to use and there is no error
      if(!validData || validData.error || !validData.schema || !validData.pos)
        return handelUpdateError(
          this,
          pos,
          settings,
          'update',
          update,
          validData.error
        )

      // Get reference to the pos
      pos = validData.pos || pos
      // Remove the current error, if one exists
      validData.schema.error && _unset(validData.schema, 'error')
      // Update the schema to ensure we are working with the updated data
      // Creates a copy of the current schema, with updated values
      let schema = updateSchema(update, { ...validData.schema })

      // Check for an update to the key and handel it
      if('key' in update){
        const updatedPos = doKeyUpdate(this, update, pos, schema, settings)

        if(!updatedPos) return
        // If there was a valid update to pos
        // Update the references to the local pos
        // So future references use the updated one
        pos = updatedPos
        
      }

      // If there's an update, and pending exists before the matchType check
      // Remove it, pending only gets set on matchType update
      schema.pending && !update.matchType && _unset(schema, 'pending')
      // Update the schema data, if nothing is returned,
      // then the update failed, so just return
      if(!doUpdateData(this, update, pos, schema, settings))
        return
      
      this.tree.schema[pos] = { ...this.tree.schema[pos], ...schema }
      schema = undefined
      validData.schema = undefined
      // Rebuild the tree from this position
      buildFromPos(this, pos, settings)
    }
    
    remove = idOrPos => {
      // Ensure the passed in update object is valid
      const validData = validateUpdate(
        this.tree,
        idOrPos,
        { mode: Schema.MODES.REMOVE },
        this.tree
      )
      // And Ensure we have a schema and pos to use
      if(!validData || validData.error || !validData.schema || !validData.pos)
        return handelUpdateError(
          this,
          this.tree.idMap[idOrPos] || idOrPos,
          settings,
          'remove',
          null,
          validData.error
        )

      const { pos, schema } = validData
      // Clear the data from the tree
      _unset(this.tree, pos)
      _unset(this.tree.idMap, schema.id)
      
      // If parent is an array, Update the parent in place,
      // and remove the value from it
      Array.isArray(schema.parent.value) &&
        schema.parent.value.splice(pos.split('.').pop(), 1);
      // Remove move the element from the dom
      const domNode = schema.component
      removeElement(domNode, domNode.parentNode)

      // Get a ref to the parent pos for re-render
      const parentPos = schema.parent.pos
      // Clear the schema from the tree schema
      clearSchema(schema, this.tree.schema)
      // Re-render from the parentPos
      buildFromPos(this, parentPos, settings)
    }
    
    add = (schema, parent, replace) => {
      const useParent = schema.parent || parent || this.tree.schema
      // Validate the passed in data
      const isValid = validateAdd(schema, useParent)
      if(!isValid || isValid.error)
        return logData(isValid.error, schema, parent, this.tree, 'warn')

      // Add the child schema to the parent / tree
      if(!addChildSchema(this.tree, schema, useParent)) return
      
      // Rebuild the tree from parent position
      buildFromPos(this, useParent.pos, settings)
    }
    
    schema = (idOrPos) => (
      _get(this, [ 'tree', 'schema',  _get(this, `tree.idMap.${idOrPos}`, idOrPos) ])
    )
    
    destroy = () => {
      ACT_SOURCE = undefined
      const rootNode = this.tree.schema[Schema.ROOT].component
      clearObj(this.tree[Schema.ROOT])
      clearObj(this.tree.idMap)
      clearObj(this.config)
      this.Types.destroy(this)
      _unset(this, 'Types')
      _unset(this, 'element')
      cleanUp(settings, this.tree)
      clearObj(this)
      if(!rootNode || !rootNode.parentNode) return

      // Remove the Root class from the parent
      rootNode.parentNode.classList &&
        rootNode.parentNode.classList.remove(Values.ROOT_CLASS)
      // Remove the root element from the parent
      removeElement(rootNode, rootNode.parentNode)
    }
  }
  
  const Tree = new jTree()
  return  Tree
}



const init = (opts) => {
  if(opts.showLogs) setLogs(true)
  const domContainer = getElement(opts.element)
  if(!domContainer)
    return logData(
      `Dom node ( element ) is required when calling the jTree init method`, 'error'
    )
  
  // Remove element, and showLogs cause we don't need them anymore
  const { element, showLogs, editor, ...options } = opts
  // Clean up the opts.element so we don't have a memory leak
  opts.element = undefined
  // Build the settings by joining with the default settings
  const settings = deepMerge(DEF_SETTINGS, options)
  const editorConfig = deepMerge(EditorConfig, editor)
  // Create the jTree Editor
  const Editor = createEditor(settings, editorConfig, domContainer)
  return Editor
}


export {
  init
}