import BaseType from '../base'
import { typesOverride, uuid } from '../../../../utils'


class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

   constructor(config){
     super(config)
      typesOverride(this, config)
   }

}

export default MapType