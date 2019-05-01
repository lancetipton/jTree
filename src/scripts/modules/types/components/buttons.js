import { er, elements } from 'element-r'
import { Icon } from './icon'
import { capitalize } from '../../../utils'
const { div, style, span  } = elements


const typeLabel = type => (
  div({ className: `type-label` }, 
    span(
      { className: `type-text ${type}-text` }, 
      `( ${capitalize(type)} )`
    )
  )
)

const btnTypes = {
  onEdit: { icon: 'pen', key: 'Edit' },
  onDrag: { icon: 'hand-point-up', key: 'Drag' },
  onDelete: { icon: 'trash-alt', key: 'Delete' },
  onSave: { icon: 'check', key: 'Save' },
  onCancel: { icon: 'times', key: 'Cancel' },
}

const buildIcon = (action, type, id) => {
  const btn = btnTypes[type] || {}
  
  return action
    ? Icon(
        btn.icon,
        btn.key,
        { icon: { 'data-tree-id': id, onclick: action } },
        type
      )
    : ''
}

const buildBtns = (id, props) => (
  Object
    .keys(btnTypes)
    .reduce((actions, key) => {
      props[key] && actions.push(buildIcon( props[key], key, id ))
      return actions
    }, [])
)

export const Buttons = (props) => {
  if(!props.id) return []

  const { id, type, ...buttons } = props
  
  return div({ className: `btns-wrapper` }, [
    div({ className: `btns-list` }, [
    typeLabel(type),
      ...buildBtns(id, buttons)
    ])
  ])
}