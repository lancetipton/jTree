'use strict';

import {
  addRemoveSchema,
  addChildSchema,
  addProp,
  addSchemaComponent,
  appendTreeHelper,
  buildFromPos,
  checkConfirm,
  cleanUp,
  clearSchema,
  getElement,
  removeElement,
  setConfirm,
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
} from './utils'

import {
  capitalize,
  checkCall,
  clearObj,
  deepMerge,
  get,
  parseJSON,
  setLogs,
  isObj,
  deepClone,
  logData,
  unset,
} from 'jsutils'

import Constants from './constants'
import { buildTypes, TypesCls } from './types'
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

const doUpdateData = (jTree, update, pos, schema, settings) => {
  let invalid
  // Loop over the allowed props to be update
  Constants.Schema.TREE_UPDATE_PROPS
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

  if(invalid && invalid.error)
    return handelUpdateError(
      jTree,
      pos,
      settings,
      invalid.prop,
      invalid.value,
      invalid.error
    )

  return true
}

const addTempProp = jTree => {
  let TEMP_ID = false
  // Add temp prop this way so we can set with string id
  // And when get it called, it returns with temp object
  addProp(jTree, 'temp', {
    get: () => {
      return {
        ...(TEMP_ID && jTree.schema(TEMP_ID) || {}),
        mode: Constants.Schema.MODES.TEMP
      }
    },
    set: id => {
      TEMP_ID = id
    },
    enumerable: true,
    configurable: true,
  })
  
  jTree.hasTemp = () => (Boolean(TEMP_ID))
}

const NO_CONFIRM_KEYS = [
  'open',
  'matchType'
]
const NO_CONFIRM_MODES = [
  'edit',
]

const shouldShowConfirm = (update) => {
  // Don't show confirm for only an update that is only an open
  const updateKeys = Object.keys(update)
  if(updateKeys.length !== 1) return true
  
  if(update.mode && NO_CONFIRM_MODES.indexOf(update.mode.toLowerCase()) !== -1)
    return false
  
  if(NO_CONFIRM_KEYS.indexOf(updateKeys[0]) !== -1)
    return false
}

const createEditor = async (settings, editorConfig, domContainer) => {

  class jTree {
    
    constructor(){
      this.Types = TypesCls(settings)
      if(!this.Types)
        return logData(`Could not load types for editor!`, 'error')

      this.element = domContainer
      this.element.classList.add(Constants.Values.ROOT_CLASS)
      const { source, ...config } = editorConfig

      this.config = config
      settings.Editor = this
      !config.noTemp && addTempProp(this)
      
      return source && this.setSource(source, true)
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
        source = parseJSON(source)

      if(!validateSource(source)) return undefined

      ACT_SOURCE = deepClone(source)
      return update && this.buildTypes()
    }

    forceUpdate = pos => {
      pos && buildFromPos(this, pos, settings)
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

      if(
        shouldShowConfirm(update) && 
        !checkConfirm(
          validData.schema,
          pos,
          update,
          `${ update.mode && capitalize(update.mode) || 'Update' } node at ${pos}?`
        )
      ) return
      

      // Remove the current error, if one exists
      validData.schema.error && unset(validData.schema, 'error')

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
        unset(this.tree.schema[pos], 'pending')

      // Update the schema data, if nothing is returned,
      // then the update failed, so just return
      if(!doUpdateData(this, update, pos, schema, settings))
        return

      if(TEMP && TEMP.id === schema.id)
        TEMP = undefined
      
      schema = undefined
      validData.schema = undefined

      // Rebuild the tree from this position
      buildFromPos(this, pos, settings)
    }

    replaceAtPos = (idOrPos, replace) => {
      // Ensure the passed in replace object is valid
      const validData = validateUpdate(
        this.tree,
        idOrPos,
        { mode: Constants.Schema.MODES.REPLACE },
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
      
      if(!checkConfirm(schema, pos, replace, `Replace ${schema.pos}?`)) return

      // Update the replace object to include the original schemas location data
      replace.pos = schema.pos
      replace.key = schema.key
      replace.parent = schema.parent
      replace.id = schema.id
      addSchemaComponent(replace, replace.id)
      
      if(replace.mode === Constants.Schema.MODES.REPLACE || replace.mode === Constants.Schema.MODES.TEMP)
        unset(replace, 'mode')

      // If it's not the same instance, remove the old one
      // New one will be re-built on next render
      schema.instance !== replace.instance && unset(replace, 'instance')
      
      // Do deep clone of value to ensure it's not a ref to other object
      // Ensures it's not a ref pointer
      replace.value = deepClone(replace.value)
      
      // Add / Remove schemas from tree
      const invalid = addRemoveSchema(replace, schema, this.tree)
      if(invalid && invalid.error)
        return handelUpdateError(
          jTree,
          pos,
          settings,
          invalid.key,
          replace[invalid.key],
          invalid.error
        )
      
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
        { mode: Constants.Schema.MODES.REMOVE },
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

      if(!checkConfirm(schema, pos, `Remove ${pos}?`)) return
      
      // Clear the data from the tree
      unset(this.tree, pos)
      unset(this.tree.idMap, schema.id)
      
      // If parent is an array, Update the parent in place,
      // and remove the value from it
      Array.isArray(schema.parent.value) &&
        schema.parent.value.splice(pos.split('.').pop(), 1);
      // Remove move the element from the dom
      const domNode = schema.domNode
      removeElement(domNode, domNode.parentNode)

      // Get a ref to the parent pos for re-render
      const parentPos = schema.parent.pos
      // Clear the schema from the tree schema
      clearSchema(schema, this.tree)

      // Re-render from the parentPos
      buildFromPos(this, parentPos, settings)
    }
    
    add = (schema, parent) => {

      const useParent = schema.parent || parent || this.tree.schema

      // Validate the passed in data
      const isValid = validateAdd(schema, useParent)
      if(!isValid || isValid.error)
        return logData(isValid.error, schema, parent, this.tree, 'warn')

      if(schema.matchType !== Constants.Schema.EMPTY && !checkConfirm(schema, useParent.pos, `Add to parent ${useParent.pos}?`))
        return

      // Add the child schema to the parent / tree
      if(!addChildSchema(this.tree, schema, useParent)) return
      
      // Rebuild the tree from parent position
      buildFromPos(this, useParent.pos, settings)
    }
    
    schema = (idOrPos) => (
      get(this, [ 'tree', 'schema',  get(this, `tree.idMap.${idOrPos}`, idOrPos) ])
    )
    
    destroy = () => {
      ACT_SOURCE = undefined
      const rootNode = get(this, `tree.schema.${Constants.Schema.ROOT}.domNode`)
      clearObj(this.tree[Constants.Schema.ROOT])
      clearObj(this.tree.idMap)

      checkCall(get(this, 'Types.destroy'), this)
      clearObj(this.tree)
      clearObj(this.config)
      unset(this, 'Types')
      unset(this, 'element')
      unset(this, 'temp')
      cleanUp(settings, this.tree)
      clearObj(this)

      if(!rootNode || !rootNode.parentNode) return
      // Remove the Root class from the parent
      const classList = get(rootNode, 'parentNode.classList')
      classList && classList.remove(Constants.Values.ROOT_CLASS)
      // Remove the root element from the parent
      removeElement(rootNode, rootNode.parentNode)
    }
  }
  
  const buildJTree = () => {
    return new jTree()
  }
  
  const jTreeEditor = await buildJTree()
  return jTreeEditor
}

const init = async (opts) => {
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
  const editorConfig = deepMerge(Constants.EditorConfig, editor)

  // Enable confirm actions
  setConfirm(editorConfig.confirmActions)
  const builtEditor = await createEditor(settings, editorConfig, domContainer)

  // Create the jTree Editor
  return builtEditor
}


export {
  init,
  Constants,
}