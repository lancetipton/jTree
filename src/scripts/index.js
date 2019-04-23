import {
  buildSettings,
  checkCall,
  clearObj,
  cloneDeep,
  deepMerge,
  getDomNode,
  isObj,
  isStr,
  logData,
  parseJSONString,
  setLogs,
  validateSource,
} from './utils'
import { cleanUp } from './clean'
import { Values } from './constants'
import { buildTypes, TypesCls, loopDataObj } from './types'
import _get from 'lodash.get'
import _set from 'lodash.set'

import { DEF_SETTINGS } from './constants'

// Cache holder for active source data
let ACT_SOURCE

/**
 * Creates or replaces a dom node on the parent node
 * Replace is referenced by ID
 * @param  { dome node } element - node to add or replace with
 * @param  { dome node } parent - parent node to add the element to
 * @return { dom node } replaced || added dom node
 */
const upsertElement = (element, parent) => {
  if(!element)
    return logData(
      `Could not add element to the dom tree. The element does not exists`,
      parent,
      'warn'
    )

  const curEl = document.getElementById(element.id)
  return curEl
    ? curEl.parentNode.replaceChild(element, curEl)
    : parent && parent.appendChild(element) ||
      logData(
        `Could not add element to the dom tree. The parent does not exists`,
        parent,
        'warn'
      )
}

/**
 * Checks if the settings.editor.appendTree method exists, and calls it
 * If response is not false, it will add the rootComp the Dom
 * @param  { dom element } rootComp of the source data passed to the Editor
 * @param  { function } appendTree - from settings.editor.appendTree ( from user )
 *                                 - should always be bound to the Editor Class
 *
 * @return { void }
 */
const appendTreeHelper = function(rootComp, appendTree){
  const res = checkCall(appendTree, rootComp, this)
  if(res === false || !this.element) return null
  upsertElement(rootComp, this.element)
}

const buildFromPos = function(pos, newValue, force, settings) {
  if(
    !isStr(pos) ||
    !this.tree ||
    !this.tree.schema ||
    !this.tree.schema[pos]
  ) return null
  const buildSchema = this.tree.schema[pos]
  const valueInTree = newValue || _get(this.tree, pos)
  // If the values are the same, just return, cause there is not update
  if(!force && valueInTree === buildSchema.value) return null
  // Otherwise set the value from the parent to the child
  buildSchema.value = valueInTree
  const updatedEl = loopDataObj(
    buildSchema,
    this.tree,
    settings,
    appendTreeHelper && appendTreeHelper.bind(this)
  )

  const replaceEl = upsertElement(updatedEl, buildSchema.parent.component)
  if(replaceEl === updatedEl) return null
  
}

const createEditor = (settings, domContainer) => {

  class jTree {
    
    constructor(){
      return TypesCls(settings)
        .then(Types => {
          this.Types = Types
          this.element = domContainer
          const { source, ...config } = settings.editor
          this.config = { ...config }
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
        null,
        true,
        settings
      ])
    }
    
    updateAtId = (id, value, check) => {
      if(!this.tree.idMap || !this.tree.idMap[id])
        return logData(
          `Tried to update the tree with and ID does not exist!`,
          id, tree, 'warn'
        )

      this.updateAtPos(this.tree.idMap[id], value, check)
    }
    
    updateAtPos = (pos, value, check) => {
      const valueInTree = check && Boolean(check && _get(this.tree, pos)) || true
      if(!valueInTree)
        return logData(
          `Tried to update the tree position that does not exist!`,
          pos, tree, 'warn'
        )
      _set(this.tree, pos, value)
      buildFromPos.apply(this, [
        pos,
        value,
        false,
        settings
      ])
    }

    destroy = () => {
      this.element = undefined
      delete this.element

      this.tree = undefined
      delete this.tree

      this.Types.destroy(this)
      this.Types = undefined
      delete this.Types
      
      ACT_SOURCE = undefined
      clearObj(this.config)
      cleanUp(settings)
    }
  }
  
  const Tree = new jTree()
  return  Tree
}



const init = (opts) => {
  if(opts.showLogs) setLogs(true)
  const domContainer = getDomNode(opts.element)
  if(!domContainer)
    return logData(
      `Dom node ( element ) is required when calling the jTree init method`, 'error'
    )
  
  // Remove element, and showLogs cause we don't need them anymore
  const { element, showLogs, ...options } = opts
  // Clean up the opts.element so we don't have a memory leak
  opts.element = undefined
  // Build the settings by joining with the default settings
  const settings = deepMerge(DEF_SETTINGS, options)
  // Create the jTree Editor
  const Editor = createEditor(settings, domContainer)
  return Editor
}


export {
  init
}