import BaseType from '../base'
import { Item } from '../../components'
import Cleave from 'cleave.js'

class NumberType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'number')

  constructor(config){
    super(config)
    this.cleaveOpts = {
      numeral: true,
      stripLeadingZeroes: false,
      ...config.cleave
    }
  }


  onChange = e => {
    console.log('------------------on change------------------');
    console.log(this);
  }
  onSave = e => {
    console.log('------------------on save------------------');
    console.log(this);
  }
  onCancel = (e, Editor) => {
    console.log(Editor);
    console.log('------------------on cancel------------------');
    console.log(this);
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

  buildCleave = (schema, itemEl) => {
      Array
        .from(itemEl.children)
        .map(child => {
          if(child.classList.contains('item-cleave')){
            this.cleave && this.clearCleave()
            this.cleave = new Cleave(child, this.cleaveOpts)
            console.log('------------------this.cleave------------------');
            console.log(this.cleave);
            this.cleave.setRawValue(schema.value)
          }
        })
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
    else if(!this.cleave) this.buildCleave(schema, domEl)
    // Else update the cleave to the current raw value
    else  this.cleave.setRawValue(schema.value)
    
    this.orgVal = schema.value
  }
  
  componentWillUnmount = (props, domEl, Editor) => {
    this.clearCleave()
    this.orgVal = undefined
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