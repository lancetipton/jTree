import { elements } from 'element-r'
import { Row } from './row'
import { ListHeader } from './list_header'
const { div, ul } = elements
    

// props.children props.id props.key props.type, props.onEdit, props.onDrag, props.onDelete,
export const List = (props) => {
  let { children, ...headerProps } = props
  
  children = children && children.map(child => Row(child, props)) || []
  
  children.unshift( Row( ListHeader(headerProps) ) )
  
  return div({ className: 'list-wrapper' }, 
    ul({ className: 'list' }, children)
  )
}