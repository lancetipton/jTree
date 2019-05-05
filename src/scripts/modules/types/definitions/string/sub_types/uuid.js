import StringType from '../string'
import { Item } from '../../../components'
import { Values } from 'jTConstants'

class UuidType extends StringType {

  static priority = 2

  static eval = value => {
    if (!value || typeof value !== 'string') return false
    const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    return regex.test(value)
  }

  constructor(config){
    super({
      ...config,
      cleave: {
        numeral: false,
        delimiter: '-',
        lowercase: true,
        blocks: [8, 4, 3, 3, 12],
        uppercase: false,
        stripLeadingZeroes: false,
        ...(config && config.cleave || {}),
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
      cleave: true,
      showLabel: true,
      type: schema.matchType,
      keyInput: 'text',
      ...actions
    })
  }


}

export default UuidType