import { er, elements } from 'element-r'
import { Icon } from './icon'
import { capitalize } from 'jTUtils'
import { Values } from 'jTConstants'
const { div, style, span  } = elements


const typeLabel = type => (
  div({ className: `type-label` }, 
    span(
      { className: `type-text ${type}-text` }, 
      `( ${capitalize(type)} )`
    )
  )
)

const showTypeValue = (type, props) => {
  if(type !== 'empty') return typeLabel(type)
  
  console.log('------------------props------------------');
  console.log(props.Types.getFlat());
  
  return null
}

const btnTypes = {
  onEdit: { icon: 'pen', key: 'Edit' },
  onDrag: { icon: 'hand-point-up', key: 'Drag' },
  onAdd: { icon: 'plus-circle', key: 'Add' },
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
        { icon: { [Values.DATA_TREE_ID]: id, onclick: action } },
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
    showTypeValue(type, props),
      ...buildBtns(id, buttons)
    ])
  ])
}