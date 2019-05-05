import BaseType from '../base'
import { Item } from '../../components'

class BooleanType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'boolean')

  constructor(config){
    super({ ...config })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType } } = props
    const options = Array.isArray(this.config.options)
      ? this.config.options
      : [ 'true', 'false']

    return Item({
      id,
      key,
      value,
      mode,
      options,
      icon: true,
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      keyInput: 'text',
      ...this.getActions(mode)
    })
  }
  
}

export default BooleanType