import StringType from '../string'

class EmailType extends StringType {
  constructor(settings){
    super(settings)
    // if(settings.priorities && settings.priorities.email)
    //   this.#priority = settings.priorities.email
  }

  #priority = 2

  static eval = value => {
    if (!value || typeof value !== 'string') return false
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return Boolean(regex.test(value))
  }

}

export default EmailType