import store from './store/store'
import { div, br, span } from '../../elementr'

const StringRender = props => {
  return div({ className: `string-div` },
    span(`Key: ${props.schema.key}`),
    br(),
    span(`Value: ${props.schema.value}`),
  )
}
export default StringRender