import BaseType from '../base'
import { Item } from '../../components'
import { Values } from 'jTConstants'

class StringType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'string')

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

  shouldComponentUpdate = (props) => {

  }
  
  componentDidUpdate = (props) => {

  }
  
  render = props => {
    const { schema } = props
    
    if(schema.mode === Values.MODES.EDIT){
      console.log('------------------edit number------------------');
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

export default StringType