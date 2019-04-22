import BaseType from '../base'

class NumberType extends BaseType {

  constructor(settings){
    super(settings)
    // if(settings.priorities && settings.priorities.number)
    //   this.#priority = settings.priorities.number
  }

  static eval = value => typeof value === 'number'
  #priority = 1
  
  build = (params) => {
    
    // console.log('------------------params------------------');
    // console.log(params.schema);
  }
  
}

export default NumberType