import BaseType from '../base'
import { Item } from '../../components'

class BooleanType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'boolean')

  constructor(config){
    super(config)
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

  shouldComponentUpdate = (params) => {}

  render = props => {

    const { schema } = props
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

export default BooleanType