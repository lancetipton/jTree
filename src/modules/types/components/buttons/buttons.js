import { er, elements } from 'element-r'
import { Icon } from './icon'
import { capitalize } from 'jTUtils'
import { Values, Schema } from 'jTConstants'
import { selectWrapper, inputWrapper } from '../sub'
const { div, style, span, option, ul, li } = elements
const btnTypes = {
  onEdit: { icon: 'pen', key: 'Edit' },
  onCopy: { icon: 'copy', key: 'Copy' },
  onCut: { icon: 'cut', key: 'Cut' },
  onPaste: { icon: 'paste', key: 'Paste' },
  // onDrag: { icon: 'hand-point-up', key: 'Drag' },
  onAdd: { icon: 'plus-square', key: 'Add' },
  onDelete: { icon: 'trash-alt', key: 'Delete' },
  onSave: { icon: 'check-square', key: 'Save' },
  onCancel: { icon: 'window-close', key: 'Cancel' },
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
  if(type !== Schema.EMPTY || !props.Types) return typeLabel(type)

  const options = Object
    .keys(props.Types.getFlat(null, { filter: [ Schema.EMPTY ] }))
    .map(value => option({
      value,
      selected: props.matchType === value
    }, capitalize(value)) )
  
  options.unshift(option({
    selected: !props.matchType
  }, 'Select Type...'))
    
  return inputWrapper(
    { type: type, showLabel: true },
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

const buildIcon = (action, type, id, wrapperProps={}) => {
  const btn = btnTypes[type] || {}
  return action
    ? Icon(
        btn.icon,
        btn.key,
        { icon: { [Values.DATA_TREE_ID]: id, onclick: action, }, wrapper: wrapperProps },
        type
      )
    : ''
}

const buildBtns = (id, props) => {
  return Object
    .keys(btnTypes)
    .reduce((actions, key) => {
      if(key === 'toggleActions') return actions
      let attrs = {}
      if(key === 'onPaste' && !props.isRoot){
        attrs = props.showPaste
          ? { className: `${Values.SHOW_PASTE_CLS} ${Values.PASTE_ACTION_CLS}` }
          : { className: `${Values.PASTE_ACTION_CLS}` }
      }

      if(props.isRoot){
        key === 'onAdd'
          ? actions.push(buildIcon( props[key], key, id, attrs ))
          : null

        return actions
      }

      props[key] && actions.push(buildIcon( props[key], key, id, attrs ))
      return actions
    }, [])
}

export const Buttons = (props) => {
  if(!props.id) return []
  const buttons = Object
    .entries(props)
    .reduce((buttons, [ key, value ]) => {
      key.indexOf('on') === 0 && typeof value === 'function' && (buttons[key] = value)

      return buttons
    }, {})
  const { id, type } = props
  buttons.showPaste = props.showPaste
  buttons.isRoot = props.isRoot
  return div({ className: `btns-wrapper` }, [
    showTypeValue(props, type),
    div({ className: `btns-list` }, [
      ...buildBtns(id, buttons)
    ])
  ])
}
