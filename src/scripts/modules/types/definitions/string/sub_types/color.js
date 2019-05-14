import StringType from '../string'

class ColorType extends StringType {

  static priority = 2

  static eval = value => {
    return  Boolean(/^#(?:(?:[A-F0-9]{2}){3,4}|[A-F0-9]{3})$/i.test(value))
  }
  constructor(config){
    super(config)
  }


}

export default ColorType