import {
  buildSettings,
  isObj,
  getDomNode,
  logData,
  parseJSONString,
  setLogs,
  clearObj,
} from './utils'
import { cleanUp } from './clean'
import { buildTypes, Types } from './types'

const createEditor = settings => {
  
  class jTree {
    
    constructor(settings){
      if(settings.data)
        this.Types = new Types(settings.types)
        this.element = settings.element
        this.setSource(settings.data)
    }
    
    setSource = data => {
      if(typeof data === 'string')
        data = parseJSONString(data)

      if(!isObj(data))
        return logData(
          `Could set source. Please make sure data is an Object or JSON parse-able string`,
          'error',
        )
      
      this.tree = buildTypes(data, this)
    }

    forceUpdate = data => {
      this.setSource(data)
    }
    
    destroy = () => {
      clearTypeCache()
      cleanUp(settings, this)

      this.element = undefined
      this.tree = undefined
    }
  }
  
  return new jTree(settings)
}



const init = (opts) => {
  if(opts.showLogs) setLogs(true)
  const domContainer = getDomNode(opts.element)
  if(!domContainer)
    return logData(
      `Dom node ( element ) is required when calling the jTree init method`, 'error'
    )

  opts.element = domContainer
  const settings = buildSettings(opts)
  const Editor = createEditor(settings)

  return Editor
}


export {
  init
}