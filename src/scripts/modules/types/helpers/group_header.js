import { er, elements } from 'element-r'
import { createIcon, iconStyles } from './create_icon'
const { div, span } = elements
import { capitalize } from '../../../utils'

export const groupHeader = (props={}) => {

  if(!props.schema) return ''
  const { schema } = props

  return div({ className: `group-header-wrapper` }, [
    span({ className: `group-header` }, [
      `${schema.key && capitalize(schema.key) + ' ' || ''}${capitalize(schema.matchType)}`
    ])
  ])
}
