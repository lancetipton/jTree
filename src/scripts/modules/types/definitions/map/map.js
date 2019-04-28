import BaseType from '../base'
import { typesOverride, uuid } from '../../../../utils'
import { er, elements } from 'element-r'
const { div, ol, li, link } = elements

class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

   constructor(config){
     super(config)
      typesOverride(this, config)
   }
  
  
  build = () => {

  }

  render = props => {
    const children = props.children || []
    
    return div({ className: `map-wrapper` },
      ol({ className: 'map-list' },
        children.map(child => li({}, child ))
      )
    )
  }

}

export default MapType