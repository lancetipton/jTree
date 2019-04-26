import BaseType from '../base'
import { div } from '../../../elementr'

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
  
  render = (props) => {
    return div({ className: `number-div` },
      props.schema.value,
    ) 
  }
  
}

export default NumberType