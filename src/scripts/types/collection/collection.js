import BaseType from '../base'

class CollectionType extends BaseType {

  constructor(settings){
    super(settings)
  }
  
  #priority = 1
  
  static eval = () => typeof value === 'object' && Array.isArray(value)
}



export default CollectionType