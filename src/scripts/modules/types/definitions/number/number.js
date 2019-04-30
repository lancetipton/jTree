import BaseType from '../base'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { elements } from 'element-r'
const { div, input } = elements

class NumberType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'number')
  static cleaves = []
  
  constructor(config){
    super(config)
    this.cleaveOpts = {
      numeral: true,
      stripLeadingZeroes: false,
      ...config.cleave
    }
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

  shouldComponentUpdate = (props, Editor) => {}
  
  componentDidUpdate = (props, domEl, Editor) => {
    const { schema } = props
    NumberType.cleaves[schema.id] &&
      NumberType.cleaves[schema.id].setRawValue(schema.value)
  }
  
  componentWillUnmount = (props, domEl, Editor) => {
    const id = props.schema.id
    NumberType.cleaves[id] && NumberType.cleaves[id].destroy()
  }
  
  render = props => {
    const { schema } = props
    if(schema.state === 'edit'){
      const domNode = input({ className: `item` }, `${schema.value}`)
      const component = div({ className: `item` },
        div({ className: 'item-key item-data' }, `${schema.key}:`),
        domNode
      )
      NumberType.cleaves[schema.id] = NumberType.cleaves[schema.id] ||
        new Cleave(domNode, this.cleaveOpts)
      return component
    }
    
    return Item({
      id: schema.id,
      key: schema.key,
      value: schema.value,
      type: schema.matchType,
      onEdit: this.onEdit,
      onDrag: this.onDrag,
      onDelete: this.onDelete
    })
  }
  
}

export default NumberType