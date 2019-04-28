import BaseType from '../base'
import { typesOverride, uuid } from '../../../../utils'
import { er, elements } from 'element-r'
import { groupHeader } from '../../helpers'
const { div, ul, li, link } = elements


const buildChild = (props, child) => {
  return li({ className: 'map-list-item' }, child )
}

class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

   constructor(config){
     super(config)
      typesOverride(this, config)
   }


  render = props => {
    const children = props.children || []
    // console.log('------------------props------------------');
    // console.log(props);
    // `map-wrapper`
    // const className = props.key !== `jTree-Root`
    //   ? `map-wrapper item-wrapper`
    //   : `map-wrapper`
    
    return div({ className: `map-wrapper` },
      groupHeader(props),
      ul({ className: 'map-list' },
        props.children && props.children.map(child => buildChild(props, child)) || ''
      )
    )
  }

}

export default MapType