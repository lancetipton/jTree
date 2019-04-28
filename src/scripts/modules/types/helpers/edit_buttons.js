import { er, elements } from 'element-r'
import { createIcon, iconStyles } from './create_icon'
import { uuid, capitalize } from '../../../utils'
const { div, style, span  } = elements

export const typeLabel = type => (
  div({ className: `type-label` }, 
    span(
      { className: `type-text ${type}-text` }, 
      `( ${capitalize(type)} )`
    )
  )
)

const btnTypes = {
  edit: 'pen',
  drag: 'hand-point-up',
  delete: 'trash-alt',
}

const buildIcon = (action, type, id) => {
  return action
    ? createIcon(
        btnTypes[type],
        `${type[0].toUpperCase()}${type.slice(1)}`,
        { icon: { id, onclick: action } },
        type
      )
    : ''
}

const buildActions = (id, props) => (
  Object
    .keys(btnTypes)
    .reduce((actions, key) => {
      props[key] && actions.push(buildIcon( props[key], key, id ))
      return actions
    }, [])
)

export const createEditBtns = (props={}) => {
  
  if(!props.id) return []

  const { id, type, ...buttons } = props
  
  return div({ className: `edit-btns-wrapper` }, [
    div({ className: `edit-btns` }, [
    typeLabel(type),
      ...buildActions(id, buttons)
    ])
  ])
}
