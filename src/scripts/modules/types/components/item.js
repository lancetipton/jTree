import { Buttons } from './buttons'
import { elements } from 'element-r'
import { capitalize } from 'jTUtils'
import { Values } from 'jTConstants'
const { div, input, label } = elements


const buildOptions = props => {
  const isEdit = props.mode === Values.MODES.EDIT
  const showLabel = isEdit && props.showLabel
  
  return isEdit
    ? { 
      El: input,
      isEdit,
      showLabel,
      keyVal: '',
      editCls: `item-edit`,
      keyAttrs: {
        class: `item-key item-data item-edit`,
        type: props.keyInput || 'text',
        value: props.key,
        [Values.DATA_SCHEMA_KEY]: 'key',
        name: `key-${props.key}`
      },
      elValue: props.value,
      valAttrs: {
        class: `item-value item-data item-edit${props.cleave && ` item-cleave` || ''}`,
        type: props.valueInput || 'text',
        [Values.DATA_SCHEMA_KEY]: 'value',
        name: `value-${props.key}`,
        value: props.value,
      }
    }
    : {
      El: div,
      isEdit,
      showLabel,
      elValue: props.value,
      keyVal: `${props.key}:`,
      editCls: '',
      keyAttrs: { class: `item-key item-data` },
      valAttrs: { class: `item-value item-data` }
    }
}


const buildItemKey = ({ showLabel, El, keyAttrs, keyVal }) => {
  const keyEl = El(keyAttrs, keyVal)
  return !showLabel
    ? keyEl
    : div({ className: 'item-data-wrapper item-key-wrapper' },
      label({ className: 'item-key-label', for: keyAttrs.name }, 'Key'),
      keyEl
    )
}

const buildItemValue = ({ showLabel, El, valAttrs, elValue }) => {
  const valEl = El(valAttrs, elValue)
  return !showLabel
    ? valEl
    : div({ className: 'item-data-wrapper item-value-wrapper' },
      label({ className: 'item-value-label', for: valAttrs.name }, 'Value'),
      valEl
    )
}

// { id, key, value, type, onEdit, onDrag, onDelete }
export const Item = (props) => {

  const opts = buildOptions(props)

  return div({ className: `item ${opts.editCls}` },
    buildItemKey(opts),
    buildItemValue(opts),
    div({ className: `item-btns item-data` },
      Buttons(props),
    )
  )
}