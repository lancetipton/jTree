import StringType from '../string'

class EmailType extends StringType {
  constructor(settings){
    super(settings)
  }

  #priority = 2

  static eval = value => {
    if (!str || typeof str !== 'string') return false
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return Boolean(regex.test(str))
  }

}

export default EmailType