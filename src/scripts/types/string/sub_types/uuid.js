import StringType from '../string'

class UuidType extends StringType {

  constructor(settings){
    super(settings)
  }

  #priority = 2

  static eval = value => {
    if (!str || typeof str !== 'string') return false
    const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    return Boolean(regex.test(str))
  }

}

export default UuidType