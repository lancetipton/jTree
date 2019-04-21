import BaseType from '../base'

class NumberType extends BaseType {

  constructor(settings){
    super(settings)
    if(settings.priorities && settings.priorities.number)
      this.#priority = settings.priorities.number
  }

  static eval = value => typeof value === 'number'
  #priority = 1
  
  build = (value, key, meta, tree, parent, settings) => {
    // console.log('------------------key------------------');
    // console.log(key);
    // console.log('------------------value------------------');
    // console.log(value);
    // console.log('------------------parent------------------');
    // console.log(parent);
  }
  
}

export default NumberType