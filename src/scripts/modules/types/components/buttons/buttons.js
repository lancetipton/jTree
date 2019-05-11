import { er, elements } from 'element-r'
import { Icon } from './icon'
import { capitalize } from 'jTUtils'
import { Values } from 'jTConstants'
import { selectWrapper, inputWrapper } from '../sub'
const { div, style, span, option } = elements
const btnTypes = {
  onEdit: { icon: 'pen', key: 'Edit' },
  onDrag: { icon: 'hand-point-up', key: 'Drag' },
  onAdd: { icon: 'plus-circle', key: 'Add' },
  onDelete: { icon: 'trash-alt', key: 'Delete' },
  onSave: { icon: 'check', key: 'Save' },
  onCancel: { icon: 'times', key: 'Cancel' },
}

const typeLabel = type => (
  div({ className: `type-label` }, 
    span(
      { className: `type-text ${type}-text` }, 
      `( ${capitalize(type)} )`
    )
  )
)

const showTypeValue = (props, type) => {
  if(type !== 'empty' || !props.Types) return typeLabel(type)

  const options = Object
    .keys(props.Types.getFlat(null, { filter: [ 'empty' ] }))
    .map(value => option({
      value,
      selected: props.matchType === value
    }, capitalize(value)) )
  
  options.unshift(option({
    selected: !props.matchType
  }, 'Select Type...'))
    
  return inputWrapper(
    { type: 'type', showLabel: true },
    selectWrapper(
      {
        class: `item-matchType item-data ${Values.EDIT_CLS}`,
        [Values.DATA_SCHEMA_KEY]: 'matchType',
        name: `type-matchType`,
        value: props.matchType,
        onChange: props.onTypeChange,
      },
      options,
    )
  )
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
    showTypeValue(props, type),
      ...buildBtns(id, buttons)
    ])
  ])
}