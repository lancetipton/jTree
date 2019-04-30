import BaseType from '../base'
import { Item } from '../../components'

class NumberType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'number')

  constructor(config){
    super(config)
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

  shouldComponentUpdate = (params) => {}

  render = props => {
    const { schema } = props

    if(schema.state === 'edit'){
      console.log('------------------render------------------');
      console.log(props);
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