import { er, elements } from 'element-r'
const { div, ul, li } = elements

const CollectionRender = (props) => {
  const children = props.children || []
  
  return div({ className: `collection-class` },
    ul({}, children.map(child => li({}, child )) )
  )
}

export default CollectionRender