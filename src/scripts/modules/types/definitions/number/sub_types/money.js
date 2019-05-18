import NumberType from '../number'
import { Item } from '../../../components'

class MoneyType extends NumberType {

  static priority = 2
  static defaultValue = '$0'
  static eval = value => {
    return typeof value === 'string' && value.indexOf('$') !== -1
  }
  
  constructor(config){
    super({
      ...config,
      cleave: {
        numeral: true,
        delimiter: ',',
        stripLeadingZeroes: true,
        numeralDecimalScale: 2,
        prefix: '$',
        noImmediatePrefix: true,
        ...(config || {}).cleave,
      }
    })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType, keyType, parent } } = props
    return Item({
      id,
      key,
      value,
      mode,
      type: matchType,
      showLabel: true,
      cleave: true,
      keyEdit: !parent || !Array.isArray(parent.value),
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }

}

export default MoneyType