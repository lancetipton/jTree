import BaseType from '../base'
import { typesOverride } from '../../utils'


class StringType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'string')
  
  constructor(config){
    super(config)
    typesOverride(this, config)
  }

  
  build = (params) => {
    // console.log('------------------params------------------');
    // console.log(params.schema);
  }
  
}

export default StringType