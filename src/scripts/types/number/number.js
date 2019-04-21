import BaseType from '../base'

class NumberType extends BaseType {

   constructor(settings){
     super(settings)
   }
  
  #priority = 1
  
  static eval = value => typeof value === 'number'
}

export default NumberType