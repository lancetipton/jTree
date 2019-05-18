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
  updateType,
  updateValue,
  upsertElement,
  validateAdd,
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

const buildFromPos = function(pos, settings, force) {
  if(
    !isStr(pos) ||
    !this.tree ||
    !this.tree.schema ||
    !this.tree.schema[pos]
  ) return null

  const updatedSchema = this.tree.schema[pos]
  const valueInTree = _get(this.tree, pos)  
  const updatedEl = loopSource(
    updatedSchema,
    this.tree,
    settings,
    appendTreeHelper && appendTreeHelper.bind(this)
  )
  
  if(pos === Schema.ROOT) return

  upsertElement(updatedEl, updatedSchema.component)
  callInstanceUpdates(this.tree, updatedSchema.pos)

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
      pos && buildFromPos.apply(this, [
        pos,
        settings,
        true,
      ])
    }

    update = (idOrPos, update) => {
      // Ensure the passed in update object is valid
      const validData = validateUpdate(idOrPos, update, this.tree)
      // And Ensure we have a schema and pos to use
      if(!validData || !validData.schema || !validData.pos) return 
      // Get reference to the pos
      let { pos } = validData

      // Update the schema to ensure we are working with the updated data
      this.tree.schema[pos] = updateSchema(update, { ...validData.schema })
      const schema = this.tree.schema[pos]

      // If there's an update, and pending exists before the matchType check
      // Remove it, pending only gets set on matchType update
      schema.pending && !update.matchType && _unset(schema, 'pending')

      // Special case for the key prop, cause we have to
      // copy the schema, and change the pos in the tree
      if(update.key){
        const updatedPos = updateKey(this.tree, pos, schema, settings)
        // If no updated pos came back
        // There was an issue updating, so just return
        if(updatedPos){
          // If there was a valid update to pos
          // Update the references to the local pos
          // So future references use the updated one
          pos = updatedPos
        }
      }

      // Loop over the allowed props to be update
      Schema.TREE_UPDATE_PROPS
        .map(prop => {
          // If the prop exists in the update acctions,
          // and the passed in update object
          // Then call the action to update it
          update[prop] &&
            UPDATE_ACTIONS[prop] &&
            UPDATE_ACTIONS[prop](this.tree, pos, schema, settings)
        })

      // Rebuild the tree from this position
      buildFromPos.apply(this, [ pos, settings ])
    }
    
    remove = idOrPos => {
      // Ensure the passed in update object is valid
      const validData = validateUpdate(idOrPos, { mode: Schema.MODES.REMOVE }, this.tree)
      // And Ensure we have a schema and pos to use
      if(!validData || !validData.schema || !validData.pos) return 
      const { pos, schema } = validData

      // Clear the data from the tree
      _unset(this.tree, pos)
      _unset(this.tree.idMap, schema.id)
      
      // If parent is an array, Update the parent in place, and remove the value from it
      Array.isArray(schema.parent.value) &&
        schema.parent.value.splice(pos.split('.').pop(), 1);
        
      // Remove move the element from the dom
      const domNode = schema.component
      removeElement(domNode, domNode.parentNode)
      // Clear the schema from the tree schema
      clearSchema(schema, this.tree.schema)
    }
    
    add = (schema, parent, replace) => {
      const useParent = schema.parent || parent || this.tree.schema
      // Validate the passed in data
      if(!validateAdd(schema, useParent)) return

      // Add the child schema to the parent / tree
      if(!addChildSchema(this.tree, schema, useParent)) return
      
      // Rebuild the tree from parent position
      buildFromPos.apply(this, [
        useParent.pos,
        settings
      ])
    }
    
    schema = (idOrPos) => (
      _get(this, [ 'tree', 'schema',  _get(this, `tree.idMap.${idOrPos}`, idOrPos) ])
    )
    
    destroy = () => {
      ACT_SOURCE = undefined
      clearObj(this.tree[Schema.ROOT])
      clearObj(this.tree.idMap)
      clearObj(this.config)
      this.Types.destroy(this)
      _unset(this, 'Types')
      _unset(this, 'element')
      cleanUp(settings, this.tree)

      clearObj(this)
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