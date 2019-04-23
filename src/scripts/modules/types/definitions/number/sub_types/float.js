import NumberType from '../number'

class FloatType extends NumberType {
  constructor(props){
    super(props)
    // if(settings.priorities && settings.priorities.float)
    //   this.#priority = settings.priorities.float
  }

  #priority = 2
  
  static eval = value => typeof value === 'number'
}

export default FloatType