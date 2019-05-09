import BaseType from '../base'
import Cleave from 'cleave.js'
import { clearObj } from 'jTUtils'
import { Values, Schema } from 'jTConstants'

const getCleaveEl = (Editor, id) => {
  const { component } = Editor.schema(id)
  return component && component.getElementsByClassName(Values.CLEAVE_CLS)[0]
}

class CleaveType extends BaseType {

  constructor(config){
    super(config)
    this.cleaveOpts = {
      onValueChanged: this.onCleaveChange,
      ...config.cleave,
    }
  }
  
  onCleaveChange = (e, Editor) => {
    const { rawValue } = e.target
    const value = parseInt(rawValue)
    const update = {
      value,
      key: this.original.key,
      original: this.original.value
    }

    this.config.expandOnChange !== false &&
      this.setWidth(getCleaveEl(Editor, this.original.id))

    this.original.value !== value &&
      this.userEvents.onChange(e, update, this.original.id, Editor) !== false &&
      (this.updated.value = update.value)
  }

  checkCleave = (schema, domNode) => {
    if(domNode.classList && domNode.classList.contains(Values.CLEAVE_CLS)){
      // Set the onValueChanged cb here, so we get access to the injected Editor
      this.cleaveOpts.onValueChanged = this.onCleaveChange
      // If a cleave instance already exists, clear it out
      this.cleave && this.clearCleave()
      // Create a new cleave instance, with the current domNode
      this.cleave = new Cleave(domNode, this.cleaveOpts)
      // Set the inital cleave value
      this.cleave.setRawValue(schema.value)
      return true
    }
  }
  
  buildEvents = (schema, domNode) => (
    domNode && Array
      .from(domNode.getElementsByTagName('input'))
      .map(input => {
        const isCleave = !this.cleave && this.checkCleave(schema, input)
        // Checks if it has the cleave class
        // Catches changes for the key input
        !isCleave && (domNode.oninput = this.onChange)
        this.config.expandOnChange !== false && this.setWidth(input)
      })
  )

  clearCleave = (rmOpts=true) => {
    if(!this.cleave) return
    this.cleave.destroy()
    this.cleave = undefined
    rmOpts && clearObj(this.cleaveOpts)
  }

  componentDidUpdate = (props, Editor) => {
    const { schema } = props
    // If not in edit mode, clear out cleave
    if(schema.mode !== Schema.MODES.EDIT) this.clearCleave(false)
    // If in edit mode, and no cleave, add the cleave to the component
    else if(!this.cleave) this.buildEvents(schema, schema.component)
    // Else update the cleave to the current raw value
    else this.cleave.setRawValue(schema.value)
    
    const { parent, instance, component, ...original } = schema
    // Update original with current schema
    this.original = original
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