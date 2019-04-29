import BaseType from '../base'
import { typesOverride, capitalize } from '../../../../utils'
import { Values } from '../../../../constants'
import { List } from '../../components'

class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

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


  render = props => {
    const isOpen = props.schema.open || props.schema.key === Values.ROOT
    let classes = `map-wrapper list-wrapper`
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

export default MapType