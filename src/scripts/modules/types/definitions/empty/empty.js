import BaseType from '../base'
import { Item } from '../../components'
import { Values, Schema } from 'jTConstants'

class EmptyType extends BaseType {

  static priority = 1
  static eval = (value) => (value === undefined)
  static defaultValue = (newType, schema, settings) => undefined

  constructor(config){
    super({ ...config })
  }

  onCancel = (e, Editor) => {
    const update = { remove: true }
    const id = this.shouldDoDefault( e, update, Editor, this.userEvents.onCancel )
    id && Editor.remove(id)
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
      schema: { id, key, value, mode, matchType, keyType },
      settings: { Editor: { Types } }
    } = props

    return Item({
      id,
      key: '',
      value: '',
      Types,
      type: Schema.EMPTY,
      showLabel: true,
      keyType: keyType || 'text',
      mode: Schema.MODES.EDIT,
      ...this.getActions(Schema.MODES.EDIT, { onTypeChange: this.onTypeChange })
    })
  }

}

export default EmptyType