import BaseType from '../base'

class MapType extends BaseType {

   constructor(settings){
     super(settings)
    if(settings.priorities && settings.priorities.map)
      this.#priority = settings.priorities.map
   }
  
  static eval = value => typeof value === 'object' && !Array.isArray(value)

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

export default MapType