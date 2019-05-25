import { elements } from 'element-r'
import { Row } from './row'
import { ListHeader } from './list_header'
const { div, ul, i } = elements
    
const checkExtraClass = (org, classes) => (
  typeof classes === 'string'
    ? `${org} ${classes}`
    : Array.isArray(classes)
      ? `${org} ${classes.join(` `)}`
      : org
)

const addEmpty = (rows, props) => {
  props.isOpen &&
    props.children &&
    !props.children.length && 
    rows.push(Row(
      { className: 'list-empty' },
      div({ className: 'list-empty-text' },
        i({className:'fas fa-ban fa-rotate-90 list-empty-icon'}),
        'Empty'
      )
    ))
}

/**
 * Build list of items based on passed in children
 * Checks for children method || use elValue, used for Select || Input dom nodes
 * @param  { object } props - data passed in from TypeClass instance
 * @return { dom node }
 */
export const List = (props) => {
  let { children, classes, styles, ...headerProps } = props
  styles = styles || {}

  const rows = children && children.map(child => Row({}, child)) || []  
  rows.unshift( Row({ className: 'list-header' }, ListHeader(headerProps) ) )
  addEmpty(rows, props)

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
      rows
    )
  )
}