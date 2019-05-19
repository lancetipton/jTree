import CleaveType from '../cleave'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { clearObj } from 'jTUtils'
import { Values } from 'jTConstants'

class NumberType extends CleaveType {

  static priority = 1
  static eval = (value) => (typeof value === 'number')
  static defaultValue = (newType, schema, settings) => 0
  
  constructor(config){
    super({
      ...config,
      cleave: {
        numeral: true,
        numeralThousandsGroupStyle: 'none',
        stripLeadingZeroes: false,
        numeralDecimalScale: 0,
        ...(config || {}).cleave,
      }
    })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType, keyType, parent, error } } = props

    return Item({
      id,
      key,
      value,
      mode,
      error,
      type: matchType,
      showLabel: true,
      cleave: true,
      isNumber: true,
      keyEdit: !parent || !Array.isArray(parent.value),
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }
  
}

export default NumberType