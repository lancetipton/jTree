import styles from './styles.css'
import { er, elements } from 'element-r'
import { createIcon, iconStyles } from './create_icon'
import { uuid } from '../../../utils'
const { div, style  } = elements

const btnStyles = () => styles

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

  const { id, styleLoader, ...buttons } = props
  
  styleLoader &&
    styleLoader.add(
      'edit-buttons', 
      btnStyles(),
      false
    )
  
  return div({ className: `edit-btns-wrapper` }, [
    div({ className: `edit-btns` }, [
      ...buildActions(id, buttons)
    ])
  ])
}
