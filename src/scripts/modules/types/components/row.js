import { elements } from 'element-r'
const { li } = elements


export const Row = (child, props) => {
  // const { schema: { id }, schema } = props
  return li({ className: 'row' }, child )
}