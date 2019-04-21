import BaseType from '../base'

class StringType extends BaseType {

   constructor(settings){
     super(settings)
     if(settings.priorities && settings.priorities.string)
      this.#priority = settings.priorities.string
   }
  
  #priority = 1

  static eval = value => typeof value === 'string'
  
  build = (value, key, meta, tree, parent, settings) => {
    // console.log('------------------key------------------');
    // console.log(key);
    // console.log('------------------value------------------');
    // console.log(value);
    // console.log('------------------parent------------------');
    // console.log(parent);
  }
  
}

export default StringType