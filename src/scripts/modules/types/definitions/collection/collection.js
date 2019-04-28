import BaseType from '../base'
import { elements } from 'element-r'
const { div, ul, li} = elements

const buildChild = (props, child) => {
  return li({ className: 'collection-list-item' }, child )
}

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
  
  render = (props) => {
    const children = props.children || []

    return div({ className: `collection-wrapper` },
      ul({ className: 'collection-list' },
        children.map(child => buildChild(props, child))
      )
    )
    
  }
  
}



export default CollectionType