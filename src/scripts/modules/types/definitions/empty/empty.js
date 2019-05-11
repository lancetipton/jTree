import BaseType from '../base'
import { Item } from '../../components'
import { Values, Schema } from 'jTConstants'

class EmptyType extends BaseType {

  static priority = 1
  static eval = (value) => (value === undefined)

  constructor(config){
    super({ ...config })
  }

  onTypeChange = (e, Editor) => {
    const input =  e.target || e.currentTarget
    const value = input.value
    const key = input.getAttribute(Values.DATA_SCHEMA_KEY)

    if(
      (value === undefined || key === undefined) ||
      (this.original[key] && this.original[key] === value)
    ) return

    value &&  this.config.expandOnChange !== false && this.setWidth(input)
    const update = { matchType: value }

    this.userEvents.onChange(e, update, this.original.id, Editor) !== false &&
      this.original.id && 
      Editor.update(this.original.id, update)

  }

  render = props => {
    const {
      schema: { id, key, value, mode, matchType },
      settings: { Editor: { Types } }
    } = props

    return Item({
      id,
      key: '',
      value: '',
      Types,
      type: 'empty',
      showLabel: true,
      keyInput: 'text',
      mode: Schema.MODES.EDIT,
      ...this.getActions(Schema.MODES.EDIT, { onTypeChange: this.onTypeChange })
    })
  }

}

export default EmptyType