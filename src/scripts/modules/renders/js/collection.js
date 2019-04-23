import store from './store'
import { div, ul, li } from './elementr'

const CollectionRender = (props) => {
  const children = props.children || []
  
  return div({ className: `collection-class` },
    ul({}, children.map(child => li({}, child )) )
  )
}

export default CollectionRender