import BaseType from '../base'
import { Item } from '../../components'

class BooleanType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'boolean')
  static defaultValue = () => true
  
  constructor(config){
    super({ ...config })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType, keyType, parent, error } } = props
    const options = Array.isArray(this.config.options)
      ? this.config.options
      : [ 'true', 'false']

    return Item({
      id,
      key,
      value: value.toString(),
      mode,
      options,
      error,
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      showPaste: Boolean(props.settings.Editor.tempId),
      keyEdit: !parent || !Array.isArray(parent.value),
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }
  
}

export default BooleanType