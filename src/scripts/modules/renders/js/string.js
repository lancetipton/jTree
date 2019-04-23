import store from './store'
import { div } from './elementr'

const StringRender = props => {
  return div({ className: `string-div` },
    props.schema.value,
  )
}
export default StringRender