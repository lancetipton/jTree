import NumberType from '../number'
import { Item } from '../../../components'

class PercentType extends NumberType {
  
  static priority = 2
  static eval = (value) => (
    typeof value === 'string' &&
    parseFloat(value) &&
    value.indexOf('%') !== -1
  )

  constructor(config){
    super(config)
  }

}

export default PercentType