import StringType from '../string'

class ColorType extends StringType {

  constructor(settings){
    super(settings)
  }

  #priority = 2

  static eval = value => {
    return  Boolean(/^#(?:(?:[A-F0-9]{2}){3,4}|[A-F0-9]{3})$/i.test(value))
  }

}

export default ColorType