import StringType from '../string'

class PhoneType extends StringType {

  static priority = 2
  static defaultValue = ''
  static allowEmptyValue = ''
  static eval = value => {
    if (!value || typeof value !== 'string') return false
    const regex = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/
    return Boolean(regex.test(value.replace(/\D/g, '')))
  }

  constructor(config){
    super(config)
  }


}

export default PhoneType