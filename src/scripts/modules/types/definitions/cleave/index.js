import BaseType from '../base'
import Cleave from 'cleave.js'
import { clearObj } from 'jTUtils'
import { Values } from 'jTConstants'

class CleaveType extends BaseType {

  constructor(config){
    super(config)
    this.cleaveOpts = {
      onValueChanged: this.onCleaveChange,
      ...config.cleave,
    }
  }
  
  onCleaveChange = e => {
    const { rawValue } = e.target
    if(this.original.value !== rawValue)
      this.updated.value = parseInt(rawValue)
  }

  checkCleave = (schema, domNode) => {
    if(domNode.classList && domNode.classList.contains('item-cleave')){
      this.cleave && this.clearCleave()
      this.cleave = new Cleave(domNode, this.cleaveOpts)
      this.cleave.setRawValue(schema.value)
      return true
    }
  }
  
  buildEvents = (schema, domNode) => {
    
    if(!domNode) return
    
    const isInput = domNode.tagName === 'INPUT'
    // Checks if it has the cleave class
    const isCleave = isInput && !this.cleave && this.checkCleave(schema, domNode)
    // Catches changes for the key input
    if(isInput){
      !isCleave && (domNode.oninput = this.onChange)
      domNode.value.length && (domNode.style.width = `${domNode.value.length}ch`)
    }

    !isInput && domNode.children.length && Array
      .from(domNode.children)
      .map(child => {
        (child.tagName === 'INPUT' || child.children.length)
        && this.buildEvents(schema, child) 
      })
  }

  clearCleave = (rmOpts=true) => {
    if(!this.cleave) return
    this.cleave.destroy()
    this.cleave = undefined
    rmOpts && clearObj(this.cleaveOpts)
  }

  componentDidUpdate = (props, domEl, Editor) => {
    const { schema } = props
    // If not in edit mode, clear out cleave
    if(schema.mode !== Values.MODES.EDIT) this.clearCleave(false)
    // If in edit mode, and no cleave, add the cleave to the component
    else if(!this.cleave) this.buildEvents(schema, domEl)
    // Else update the cleave to the current raw value
    else this.cleave.setRawValue(schema.value)
    
    this.original = {
     value: schema.value,
     key: schema.key,
     mode: schema.mode,
     matchType: schema.matchType,
    }
    // Clear out the updated, because we just updated
    this.updated && clearObj(this.updated)
  }
  
  componentWillUnmount = (Editor) => {
    this.clearCleave()
    clearObj(this.original)
    clearObj(this.updated)
  }

}

export default CleaveType