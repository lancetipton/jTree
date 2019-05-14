import NumberType from '../number'
import { Item } from '../../../components'

class FloatType extends NumberType {
  static priority = 2
  static eval = (value) => (
    typeof value === 'number' &&
      Number(value) === value && 
      value % 1 !== 0
  )

  constructor(config){
    super(config)
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
      cleave: true,
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }

}

export default FloatType