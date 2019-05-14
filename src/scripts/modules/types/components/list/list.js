import { elements } from 'element-r'
import { Row } from './row'
import { ListHeader } from './list_header'
const { div, ul } = elements
    
const checkExtraClass = (org, classes) => (
  typeof classes === 'string'
    ? `${org} ${classes}`
    : Array.isArray(classes)
      ? `${org} ${classes.join(` `)}`
      : org
)

/**
 * Build list of items based on passed in children
 * Checks for children method || use elValue, used for Select || Input dom nodes
 * @param  { object } props - data passed in from TypeClass instance
 * @return { dom node }
 */
export const List = (props) => {
  let { children, classes, styles, ...headerProps } = props
  styles = styles || {}
  children = children && children.map(child => Row({}, child)) || []  
  children.unshift( Row({ className: 'list-header' }, ListHeader(headerProps) ) )

  return div(
    {
      className: checkExtraClass('list-wrapper', classes),
      style: styles.wrapper
    }, 
    ul(
      { 
        className: checkExtraClass('list', classes),
        style: styles.list
      },
      children
    )
  )
}