import CleaveType from '../cleave'
import { Item } from '../../components'
import { Values, Schema } from 'jTConstants'

class StringType extends CleaveType {

  static priority = 1
  static eval = (value) => (typeof value === 'string')
  static defaultValue = (newType, schema, settings) => ''
  
  constructor(config){
    super({
      ...config,
      cleave: {
        numeral: false,
        stripLeadingZeroes: false,
        ...(config && config.cleave || {}),
      }
    })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType, keyType } } = props
    return Item({
      id,
      key,
      value,
      mode,
      type: matchType,
      showLabel: true,
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }

}

export default StringType