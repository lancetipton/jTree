import { er, elements } from 'element-r'
const { div, br, span } = elements

const StringRender = props => {
  return div({ className: `string-div` },
    span(`Key: ${props.schema.key}`),
    br(),
    span(`Value: ${props.schema.value}`),
  )
}
export default StringRender