import StringType from '../string'

class PhoneType extends StringType {

  constructor(settings){
    super(settings)
  }

  #priority = 2

  static eval = value => {
    if (!str || typeof str !== 'string') return false
    const regex = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/
    return Boolean(regex.test(str.replace(/\D/g, '')))
  }

}

export default PhoneType