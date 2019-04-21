import BaseType from '../base'

class CollectionType extends BaseType {

  constructor(settings){
    super(settings)
    if(settings.priorities && settings.priorities.collection)
      this.#priority = settings.priorities.collection
  }
  
  static eval = value => typeof value === 'object' && Array.isArray(value)

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



export default CollectionType