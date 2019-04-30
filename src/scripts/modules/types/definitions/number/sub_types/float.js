import NumberType from '../number'
import { Item } from '../../../components'

class FloatType extends NumberType {
  static priority = 2
  static eval = (value) => (
    typeof value === 'number' &&
      Number(value) === value && 
      value % 1 !== 0
  )

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

export default FloatType