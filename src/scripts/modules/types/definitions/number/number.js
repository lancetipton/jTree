import BaseType from '../base'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { getMutationObserver, debounce } from '../../../../utils'

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
    
  }
  
  onCleaveChange = e => {
    const { rawValue } = e.target
    if(this.orgVal !== rawValue) this.curVal = rawValue
  }

  onChange = e => {
    console.log('------------------e.currentTarget------------------');
    console.log(e.currentTarget.value);
    console.log(e.target.value);
    
  }
  onSave = (e, Editor) => {
    const id = e.currentTarget.getAttribute('data-tree-id')
    if(!id) return
    
    Editor.updateAtId(id, parseInt(this.curVal), true, false)
    // Editor.updateSchema(id, 'edit', false)
  }

  onCancel = (e, Editor) => {
    const id = e.currentTarget.getAttribute('data-tree-id')
    if(!id) return
    
    Editor.updateAtId(id, this.orgVal, true, false)
    Editor.updateSchema(id, 'edit', false)
  }

  onEdit = (e, Editor) => {
    const id = e.currentTarget.getAttribute('data-tree-id')
    if(!id) return

    const pos = Editor.tree.idMap[id]
    const schema = Editor.tree.schema[pos]
    Editor.updateSchema(id, 'edit', true)
  }

  onDrag = e => {
    console.log(this);
  }

  onDelete = e => {
    console.log(this);
  }

  onChange = e => {
    console.log('------------------change------------------');
    console.log(e.target.value);
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
    // if(this.orgVal && this.orgVal === props.schema.value)
    //   return false
  }
  
  componentDidUpdate = (props, domEl, Editor) => {
    const { schema } = props
    // If not in edit mode, clear out cleave
    if(schema.state !== 'edit') this.clearCleave()
    // If in edit mode, and no cleave, add the cleave to the component
    else if(!this.cleave) this.buildEvents(schema, domEl)
    // Else update the cleave to the current raw value
    else  this.cleave.setRawValue(schema.value)
    
    this.orgVal = schema.value
  }
  
  componentWillUnmount = (props, domEl, Editor) => {
    console.log('------------------will unmount------------------');
    this.clearCleave()
    this.orgVal = undefined
    this.curVal = undefined
  }
  
  render = props => {
    const { schema } = props
    // schema.state = 'edit'
    const actions = schema.state !== 'edit'
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
      state: schema.state,
      showLabel: true,
      cleave: true,
      type: schema.matchType,
      keyInput: 'text',
      ...actions
    })
  }
  
}

export default NumberType