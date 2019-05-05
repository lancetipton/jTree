import CleaveType from '../cleave'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { clearObj } from 'jTUtils'
import { Values } from 'jTConstants'

class NumberType extends CleaveType {

  static priority = 1
  static eval = (value) => (typeof value === 'number')

  constructor(config){
    super({
      ...config,
      cleave: {
        numeral: true,
        stripLeadingZeroes: false,
        ...config.cleave,
      }
    })
  }
  
  render = props => {
    
    const { schema } = props
    const actions = schema.mode !== Values.MODES.EDIT
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
      mode: schema.mode,
      showLabel: true,
      cleave: true,
      type: schema.matchType,
      keyInput: 'text',
      ...actions
    })
  }
  
}

export default NumberType