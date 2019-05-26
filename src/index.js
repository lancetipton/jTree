'use strict';

import {
  addChildSchema,
  addProp,
  appendTreeHelper,
  buildFromPos,
  buildInstance,
  callInstanceUpdates,
  checkCall,
  cleanUp,
  clearObj,
  clearSchema,
  cloneDeep,
  deepMerge,
  getElement,
  isObj,
  isStr,
  logData,
  mapObj,
  parseJSONString,
  removeElement,
  setLogs,
  upsertElement,
  updateKey,
  updateSchema,
  updateSchemaError,
  updateSchemaProp,
  updateType,
  updateValue,
  validateAdd,
  validateKey,
  validateSource,
  validateUpdate,
  loopSource,
} from 'jTUtils'
import { Values, Schema, EditorConfig } from 'jTConstants'
import { buildTypes, TypesCls } from './types'
import UndoManager from './undo'
import _get from 'lodash.get'
import _set from 'lodash.set'
import _unset from 'lodash.unset'

import { DEF_SETTINGS } from './constants'

const UPDATE_ACTIONS = {
  matchType: updateType,
  value: updateValue,
  open: updateSchemaProp,
  mode: updateSchemaProp,
  error: updateSchemaProp
}

// Cache holder for active source data
let ACT_SOURCE
let TEMP
let UNDO_MANAGER
/**
 * Updates the schema where the error occurred
 * Rebuilds the tree from the position the error occurred
 * @param  { object } jTree - jTree editor object
 * @param  { string } pos - location of the error
 * @param  { object } settings - config to for the tree data
 * @param  { string } prop - property where the error occurred
 * @param  { any } value - value that the error occurred on
 * @param  { string } message - error message
 *
 * @return { void }
 */
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

const doUpdateData = (jTree, update, pos, schema, settings, change) => {
  let invalid
  // Loop over the allowed props to be update
  Schema.TREE_UPDATE_PROPS
    .map(prop => {
      // Only keep doing update when no error exists
      if(invalid) return

      // If the prop exists in the update actions,
      // and the passed in update object
      // Then call the action to update it
      invalid = prop in update && 
        checkCall(UPDATE_ACTIONS[prop], jTree.tree, pos, schema, settings, prop)
      
      if(!invalid) return
        invalid.prop = prop
        invalid.value = update[prop]
    })

  if(invalid && invalid.error) {
    handelUpdateError(
      jTree,
      pos,
      settings,
      invalid.prop,
      invalid.value,
      invalid.error
    )
    change && (change.from = undefined)

    return false
  }

  if(change)
    change.to = {
      pos,
      id: schema.id,
      value: schema.value,
      key: schema.key,
      mode: schema.mode,
      keyType: schema.keyType,
      matchType: schema.matchType,
      ...update
    }

  return true
}

const createEditor = (settings, editorConfig, domContainer) => {
  let TEMP_ID = false
  console.log(`TODO:`);
  console.log(`Need to clear out child data from schema and idMap after and updat or change. Need to move undo switch logic to helper and join it with replace.`);

  class jTree {
    
    constructor(){
      TypesCls(settings)
        .then(Types => {
          this.Types = Types
          this.element = domContainer
          this.element.classList.add(Values.ROOT_CLASS)
          const { source, ...config } = editorConfig
          this.config = config
          settings.Editor = this
          return source && this.setSource(source, true)
        })
        .then(() => {
          // if(!this.config || !this.config.undo) return this
          UNDO_MANAGER = new UndoManager(this.config.undo || {})
          this.setDoLimit = UNDO_MANAGER.setLimit.bind(this)
          this.hasDo = UNDO_MANAGER.has.bind(this)

          return this
        })
    }
    
    undo = () => {
      const undo = UNDO_MANAGER.undo()
      if(!undo) return logData(`No undos to use!`)

      const schema = this.schema(undo.to.id || undo.from.id)
      if(!schema)
        return logData(`No schema found!`, `error`)
        
      const update = { ...schema }
      const updateKeys = Object.keys(UPDATE_ACTIONS).concat(
        [ 'pending', 'key', 'pos', ]
      )

      if(!undo || !undo.from || !update) return
      updateKeys.map(key => {
        undo.from[key] !== update[key] &&
          (update[key] = undo.from[key])
      })

      _unset(this.tree, schema.pos)
      _unset(this.tree.idMap, schema.id)
      _unset(this.tree.schema, schema.pos)
      
      this.tree.schema[update.pos] = update
      this.tree.idMap[update.id] = update.pos
      _set(this.tree, update.pos, update.value)
      const parent = update.parent || schema.parent
      parent &&
        parent.pos &&
        buildFromPos(
          this,
          parent.pos,
          settings
        )
    }
    
    redo = () => {
      const item = UNDO_MANAGER.redo()
    }
    
    buildTypes = source => {
      if(source && source !== ACT_SOURCE)
        return this.setSource(source)
      
      if(!isObj(ACT_SOURCE))
        return logData(`Could build types, source data is invalid!`, ACT_SOURCE, 'warn')
      
      if(isObj(ACT_SOURCE))
        this.tree = buildTypes(ACT_SOURCE, settings, appendTreeHelper)

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
      const change = {}
      if(UNDO_MANAGER)
        change.from = {
          pos,
          id: validData.schema.id,
          value: validData.schema.value,
          key: validData.schema.key,
          mode: validData.schema.mode,
          keyType: validData.schema.keyType,
          matchType: validData.schema.matchType
        }

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
      this.tree.schema[pos].pending &&
        !update.matchType &&
        _unset(this.tree.schema[pos], 'pending')

      // Update the schema data, if nothing is returned,
      // then the update failed, so just return
      if(!doUpdateData(this, update, pos, schema, settings, change))
        return
      
      if(TEMP && TEMP.id === schema.id)
        TEMP = undefined
      
      schema = undefined
      validData.schema = undefined
      // Rebuild the tree from this position
      buildFromPos(this, pos, settings)
      
      if(!UNDO_MANAGER) return

      UNDO_MANAGER.add(change)
    }
    
    hasTemp = () => (Boolean(TEMP_ID))

    replace = (idOrPos, replace) => {
      // Ensure the passed in replace object is valid
      const validData = validateUpdate(
        this.tree,
        idOrPos,
        { mode: Schema.MODES.REPLACE },
        settings
      )

      // And Ensure we have a schema and pos to use
      if(!validData || validData.error || !validData.schema || !validData.pos)
        return handelUpdateError(
          this,
          this.tree.idMap[idOrPos] || idOrPos,
          settings,
          'replace',
          null,
          validData.error
        )
        
      // Get the old schema
      const { pos, schema } = validData
      replace.parent = schema.parent
      replace.component = schema.component
      replace.id = schema.id
      _unset(replace, 'mode')

      // Remove id from the idMap
      _unset(this.tree.idMap, schema.id)
      
      const notSameInstance = schema.instance !== replace.instance
      // Clear out old schema
      clearSchema(schema, this.tree.schema, notSameInstance)
      // If it's not the same instance, remove the old one
      // New one will be re-built on next render
      notSameInstance && _unset(replace, 'instance')

      // Do deep clone of value to ensure it's not a ref to other object
      // Ensures it is entirely it's own
      replace.value = cloneDeep(replace.value)

      // Update the value at the pos
      _set(this.tree, pos, replace.value)
      // Set new schema
      this.tree.schema[pos] = replace
      // add id to idMap
      this.tree.idMap[replace.id] = pos

      // Re-render from the parentPos
      replace.parent &&
        replace.parent.pos &&
        buildFromPos(
          this,
          replace.parent && replace.parent.pos,
          settings
        )
    }
    
    remove = idOrPos => {
      // Ensure the passed in update object is valid
      const validData = validateUpdate(
        this.tree,
        idOrPos,
        { mode: Schema.MODES.REMOVE },
        settings
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
  
  const jTEditor = new jTree()
  // Add temp prop this way so we can set with string id
  // And when get it called, it returns with temp object
  addProp(jTEditor, 'temp', {
    get: () => {
      return {
        ...(TEMP_ID && jTEditor.schema(TEMP_ID) || {}),
        mode: Schema.MODES.TEMP
      }
    },
    set: id => {
      TEMP_ID = id
    },
    enumerable: true,
    configurable: true,
  })

  return  jTEditor
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