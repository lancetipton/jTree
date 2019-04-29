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
  edit: 'pen',
  drag: 'hand-point-up',
  delete: 'trash-alt',
}

const buildIcon = (action, type, id) => {
  return action
    ? Icon(
        btnTypes[type],
        capitalize(type),
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

export const Buttons = (props) => {
  if(!props.id) return []

  const { id, type, ...buttons } = props
  
  return div({ className: `btns-wrapper` }, [
    div({ className: `btns-list` }, [
    typeLabel(type),
      ...buildActions(id, buttons)
    ])
  ])
}