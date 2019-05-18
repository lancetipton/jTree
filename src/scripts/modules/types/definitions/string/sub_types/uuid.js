import StringType from '../string'
import { Item } from '../../../components'
import { Values, Schema } from 'jTConstants'

class UuidType extends StringType {

  static priority = 2
  static defaultValue = ''
  static allowEmptyValue = ''
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

}

export default UuidType