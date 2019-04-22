import BaseType from '../base'

class CollectionType extends BaseType {
  
  static priority = 1
  static eval = value => typeof value === 'object' && Array.isArray(value)
  
  constructor(settings){
    super(settings)
  }
  
  build = (params) => {
    // console.log('------------------params------------------');
    // console.log(params.schema);
  }

}



export default CollectionType