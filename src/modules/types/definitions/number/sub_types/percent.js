import NumberType from '../number'
import { Item } from '../../../components'

class PercentType extends NumberType {
  
  static priority = 2
  static defaultValue = '%0'
  static eval = value => {
    return typeof value === 'string' && value.indexOf('%') !== -1
  }


  constructor(config){
    super({
      ...config,
      cleave: {
        numeral: true,
        numeralThousandsGroupStyle: 'none',
        stripLeadingZeroes: false,
        numeralDecimalScale: 2,
        prefix: '%',
        noImmediatePrefix: true,
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
      showPaste: props.settings.Editor.hasTemp(),
      keyEdit: !parent || !Array.isArray(parent.value),
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }

}

export default PercentType