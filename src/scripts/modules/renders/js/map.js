import { er, elements } from 'element-r'
const { div, ol, li } = elements

const MapRender = props => {
  const children = props.children || []

  return div({ className: `map-class` },
    ol({}, children.map(child => li({}, child )) )
  )
}

export default MapRender