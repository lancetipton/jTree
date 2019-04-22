import NumberType from '../number'

class MoneyType extends NumberType {
  constructor(props){
    super(props)
    // if(settings.priorities && settings.priorities.money)
    //   this.#priority = settings.priorities.money
  }

  #priority = 2
  
  static eval = value => typeof value === 'number'
}

export default MoneyType