import {
  buildSettings,
  checkCall,
  clearObj,
  cloneDeep,
  deepMerge,
  getDomNode,
  isObj,
  logData,
  parseJSONString,
  setLogs,
  validateSource,
} from './utils'
import { cleanUp } from './clean'
import { buildTypes, TypesCls } from './types'

import { DEF_SETTINGS } from './constants'

// Cache holder for active source data
let ACT_SOURCE

const cleanSettingsObj = settings => {
  clearObj(settings.editor)
  settings.editor = undefined
  delete settings.editor
}

const createEditor = (settings, domContainer) => {
  class jTree {
    
    constructor(){
      TypesCls(settings)
        .then(Types => {
          this.Types = Types
          this.element = domContainer
          const { source, ...config } = settings.editor
          
          this.config = { ...config }
          settings.Editor = this
          source && this.setSource(source, true)
        })
    }
    
    appendTree = (rootComp, props) => {
      const res = checkCall(settings.editor.appendTree, rootComp, settings.Editor)
      if(res === false || !this.element) return null

      rootComp && this.element.appendChild(rootComp)
    }
    
    buildTypes = source => {
      if(source && source !== ACT_SOURCE)
        return this.setSource(source)
      
      if(!isObj(ACT_SOURCE))
        return logData(`Could build types, source data is invalid!`, ACT_SOURCE, 'warn')
      
      if(isObj(ACT_SOURCE))
        this.tree = buildTypes(ACT_SOURCE, settings)
    }

    setSource = (source, update) => {
      if(typeof source === 'string')
        source = parseJSONString(source)

      if(!validateSource(source)) return undefined

      ACT_SOURCE = cloneDeep(source)
      update && this.buildTypes()
    }
    
    forceUpdate = source => {
      this.setSource(source, true)
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
      cleanSettingsObj(settings)
      cleanUp(this.config)
      cleanUp(settings)
    }
  }
  
  return new jTree()
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