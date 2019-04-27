import { er, elements } from 'element-r'
const { div } = elements

const NumberRender = (props) => {
  return div({ className: `number-div` },
    props.schema.value,
  ) 
}
export default NumberRender