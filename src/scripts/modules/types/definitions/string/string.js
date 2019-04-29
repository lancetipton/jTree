import BaseType from '../base'
import { typesOverride } from '../../../../utils'
import { Item } from '../../components'

class StringType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'string')

  constructor(config){
    super(config)
    typesOverride(this, config)
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

  build = (params) => {}

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

export default StringType