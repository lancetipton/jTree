import BaseType from '../base'
import Cleave from 'cleave.js'
import { clearObj } from 'jTUtils'
import { Values, Schema } from 'jTConstants'

const getCleaveEl = (Editor, id) => {
  const schema = Editor.schema(id)
  return schema &&
    schema.domNode &&
    schema.domNode.getElementsByClassName(Values.CLEAVE_CLS)[0]
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
    // Sometimes this method gets called before the cleave is initialized
    // So if no cleave, but return 
    if(!this.cleave) return
    // If there is no cleave element, then just return
    // this method should never have been called
    if(!this.cleave.element)
      return console.warn(`Called onCleaveChange but no cleave element exists`, this)

    const update = {
      value: e.target.rawValue,
      key: this.cleave.element.getAttribute(Values.DATA_SCHEMA_KEY),
      original: this.original.value
    }

    // Check if the input should be a number
    if(this.cleave.element.classList.contains(Values.NUMBER_CLS)){
      const numVal = Number(update.value)
      // If it's a valid number use that instead
      !isNaN(numVal) && (update.value = numVal)
    }

    // Ensure we have a valid key and value, and there was an update
    if(
      (update.value === undefined || update.key === undefined) ||
      (this.original[update.key] && this.original[update.key] === update.value)
    ) return

    this.config.expandOnChange !== false &&
      this.setWidth(getCleaveEl(Editor, this.original.id))

    return this.original.value !== update.value &&
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
      // Set the initial cleave value
      this.cleave.setRawValue(schema.value)
      return true
    }
  }
  
  buildEvents = (schema, domNode) => (
    domNode && Array
      .from(domNode.getElementsByTagName('input'))
      .map(input => {
        // Checks if it has the cleave class
        // Catches changes for the key input
        !this.cleave && this.checkCleave(schema, input)
          ? (domNode.oninput = undefined)
          : (domNode.oninput = this.onChange)

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
    // If in edit mode, and no cleave, add the cleave to the domNode
    else if(!this.cleave) this.buildEvents(schema, schema.domNode)
    // Else update the cleave to the current raw value
    else this.cleave.setRawValue(schema.value)
    
    const { parent, instance, domNode, ...original } = schema
    // Update original with current schema
    this.original = original
    // Clear out the updated, because we just updated
    this.updated && clearObj(this.updated)
  }
  
  componentWillUnmount = (Editor) => {
    // Set to undefined, because when the instance gets remove, we don't want it 
    // to remove the value; it's a ref to the actual value in the tree
    this.original.value = undefined
    this.clearCleave()
  }

}

export default CleaveType