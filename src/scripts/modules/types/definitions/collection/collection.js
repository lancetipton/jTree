import BaseType from '../base'
import { capitalize } from 'jTUtils'
import { Values } from 'jTConstants'
import { List } from '../../components'

class CollectionType extends BaseType {
  
  static priority = 1
  static eval = value => typeof value === 'object' && Array.isArray(value)
  
  constructor(settings){
    super(settings)
  }
  
  onEdit = e => {
    
    console.log(this);
  }

  onDrag = e => {
    console.log(this);
  }

  onDelete = e => {
    console.log(this);
  }


  render = props => {
    const isOpen = props.schema.open || props.schema.key === Values.ROOT
    let classes = `list-wrapper`
    classes += isOpen && ` list-open` || ''

    return List({
      children: props.children,
      id: props.schema.id,
      key: props.schema.key,
      value: props.schema.value,
      type: props.schema.matchType,
      onEdit: this.onEdit,
      onDrag: this.onDrag,
      onDelete: this.onDelete
    })
  }
  
}



export default CollectionType