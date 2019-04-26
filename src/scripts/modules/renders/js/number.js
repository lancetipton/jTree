import store from './store/store'
import { div } from '../../elementr'

const NumberRender = (props) => {
  return div({ className: `number-div` },
    props.schema.value,
  ) 
}
export default NumberRender