import BaseType from '../base'

class StringType extends BaseType {

   constructor(settings){
     super(settings)
   }
  
  #priority = 1

  static eval = value => typeof value === 'string'
}

export default StringType