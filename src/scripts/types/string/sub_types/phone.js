import StringType from '../string'

class PhoneType extends StringType {

  constructor(settings){
    super(settings)
    if(settings.priorities && settings.priorities.phone)
      this.#priority = settings.priorities.phone
  }

  #priority = 2

  static eval = value => {
    if (!value || typeof value !== 'string') return false
    const regex = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/
    return Boolean(regex.test(value.replace(/\D/g, '')))
  }

}

export default PhoneType