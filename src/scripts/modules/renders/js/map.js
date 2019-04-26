import store from './store/store'
import { div, ol, li } from '../../elementr'

const MapRender = props => {
  const children = props.children || []

  return div({ className: `map-class` },
    ol({}, children.map(child => li({}, child )) )
  )
}

export default MapRender