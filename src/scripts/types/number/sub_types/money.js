import NumberType from '../number'

class MoneyType extends NumberType {
  constructor(props){
    super(props)
  }

  #priority = 2
  
  static eval = value => typeof value === 'number'
}

export default MoneyType