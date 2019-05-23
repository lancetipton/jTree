import StringType from '../string'
import { Item } from '../../../components'

const luhn = cardnumber => {
  const getdigits = /\d/g
  const digits = []
  while (match = getdigits.exec(cardnumber))
    digits.push(parseInt(match[0], 10))

  let sum = 0
  let alt = false
  digits.map(digit => {
    if (alt) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    alt = !alt
  })

  return sum % 10 == 0
    ? true
    : false
}

const cardValidate = {
  visa: value => value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?)$/),
  master: value => value.match(/^(?:5[1-5][0-9]{14})$/),
  jcb: value => value.match(/^(?:(?:2131|1800|35\d{3})\d{11})$/),
  discover: value => value.match(/^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/),
  diners: value => value.match(/^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/),
  amx: value => value.match(/^(?:3[47][0-9]{13})$/),
}

class CardType extends StringType {

  static priority = 2
  static defaultValue = ''
  // static allowEmptyValue = ''
  static eval = value => {
    let validCard
    Object
      .keys(cardValidate)
      .entries(([ type, test ]) => {
        if(!validCard && test(value)) validCard = type
      })

    return validCard
      ? luhn(value)
      : false
  }

  constructor(config){
    super({
      ...config,
      cleave: {
        creditCard: true,
        ...(config && config.cleave || {}),
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
      showPaste: Boolean(props.settings.Editor.tempId),
      keyEdit: !parent || !Array.isArray(parent.value),
      keyType: keyType || 'text',
      ...this.getActions(mode)
    })
  }

}

export default CardType