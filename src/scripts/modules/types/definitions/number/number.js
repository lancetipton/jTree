import BaseType from '../base'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { getMutationObserver, debounce, isFunc } from 'jTUtils'
import { Values } from 'jTConstants'

class NumberType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'number')

  constructor(config){
    super(config)
    this.cleaveOpts = {
      numeral: true,
      stripLeadingZeroes: false,
      onValueChanged: this.onCleaveChange,
      ...config.cleave
    }
    this.obsOpts = {
      ...config.observer,
    }
    this.updateObj = {}
    this.orgObj = {}
    config.onChange && (this.customChange = config.onChange)
    
  }
  
  onCleaveChange = e => {
    const { rawValue } = e.target
    if(this.orgObj.value !== rawValue)
      this.updateObj.value = parseInt(rawValue)
  }

  onChange = (e, Editor) => {
    const value = e.target && e.target.value || e.currentTarget && e.currentTarget.value
    const key = e.currentTarget.getAttribute(Values.DATA_SCHEMA_KEY)
    if(
      (value === undefined || key === undefined) ||
      (this.orgObj[key] && this.orgObj[key] === value)
    ) return
    
    return (
      !isFunc(this.customChange) ||
      this.customChange(key, value, Editor) !== false
    ) && (
      this.updateObj[key] = value
    )
  }

  onSave = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    id &&
      Editor.update(id, {
        ...this.updateObj,
        mode: undefined,
      })
  }

  onCancel = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)

    id &&
      Editor.update(id, { mode: undefined, value: this.orgObj.value })
  }

  onEdit = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    id &&
      Editor.update(id, { mode: Values.MODES.EDIT })
  }

  onDrag = e => {
    console.log(this);
  }

  onDelete = e => {
    console.log(this);
  }

  checkCleave = (schema, domNode) => {
    if(domNode.classList && domNode.classList.contains('item-cleave')){
      this.cleave && this.clearCleave()
      this.cleave = new Cleave(domNode, this.cleaveOpts)
      this.cleave.setRawValue(schema.value)
      domNode = undefined
      return true
    }
  }
  
  buildEvents = (schema, domNode) => {
    
    if(!domNode) return
    
    const isInput = domNode.tagName === 'INPUT'
    // Checks if it has the cleave class
    const isCleave = isInput && !this.cleave && this.checkCleave(schema, domNode)
    // Catches changes for the key input
    if(isInput && !isCleave) domNode.oninput = this.onChange
    
    !isInput && domNode.children.length && Array
      .from(domNode.children)
      .map(child => {
        (child.tagName === 'INPUT' || child.children.length)
        && this.buildEvents(schema, child) 
      })

    // Clear out domNode just so we don't have any memory leaks
    domNode = undefined
  }

  clearCleave = () => {
    if(!this.cleave) return
    this.cleave.destroy()
    this.cleave = undefined
  }

  shouldComponentUpdate = (props, Editor) => {
    // if(this.orgObj.value && this.orgObj.value === props.schema.value)
    //   return false
  }
  
  componentDidUpdate = (props, domEl, Editor) => {
    const { schema } = props
    // If not in edit mode, clear out cleave
    if(schema.mode !== Values.MODES.EDIT) this.clearCleave()
    // If in edit mode, and no cleave, add the cleave to the component
    else if(!this.cleave) this.buildEvents(schema, domEl)
    // Else update the cleave to the current raw value
    else  this.cleave.setRawValue(schema.value)
    
    this.orgObj = {
     value: schema.value,
     key: schema.key,
     mode: schema.mode,
     matchType: schema.matchType,
    }
  }
  
  componentWillUnmount = (props, domEl, Editor) => {
    this.clearCleave()
    this.orgObj = undefined
    this.updateObj = undefined
  }
  
  render = props => {
    const { schema } = props
    // schema.mode = Values.MODES.EDIT
    const actions = schema.mode !== Values.MODES.EDIT
      ? {
        onEdit: this.onEdit,
        onDrag: this.onDrag,
        onDelete: this.onDelete
      }
      : {
        onChange: this.onChange,
        onSave: this.onSave,
        onCancel: this.onCancel,
      }

    return Item({
      id: schema.id,
      key: schema.key,
      value: schema.value,
      mode: schema.mode,
      showLabel: true,
      cleave: true,
      type: schema.matchType,
      keyInput: 'text',
      ...actions
    })
  }
  
}

export default NumberType