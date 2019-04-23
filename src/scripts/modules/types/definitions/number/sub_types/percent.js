import NumberType from '../number'

class PercentType extends NumberType {
  constructor(props){
    super(props)
    // if(settings.priorities && settings.priorities.percent)
    //   this.#priority = settings.priorities.percent
  }

  #priority = 2
  
  static eval = value => typeof value === 'number'
}

export default PercentType