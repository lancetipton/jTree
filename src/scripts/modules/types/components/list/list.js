import { elements } from 'element-r'
import { Row } from './row'
import { ListHeader } from './list_header'
const { div, ul } = elements
    
const wrapClass = classes => (
  typeof classes === 'string'
    ? `list-wrapper ${classes}`
    : Array.isArray(classes)
      ? `list-wrapper ${classes.join(` `)}`
      : `list-wrapper`
)

/**
 * Build list of items based on passed in children
 * Checks for children method || use elValue, used for Select || Input dom nodes
 * @param  { object } props - data passed in from TypeClass instance
 * @return { dom node }
 */
export const List = (props) => {
  let { children, classes, ...headerProps } = props
  
  children = children && children.map(child => Row(child, props)) || []
  
  children.unshift( Row( ListHeader(headerProps) ) )
  
  return div({ className: wrapClass(classes) }, 
    ul({ className: 'list' }, children)
  )
}