import BaseType from '../base'

class MapType extends BaseType {

   constructor(settings){
     super(settings)
   }
  
  #priority = 1
  
  static eval = () => typeof value === 'object' && !Array.isArray(value)
}

export default MapType