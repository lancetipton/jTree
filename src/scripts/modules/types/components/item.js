import { Buttons } from './buttons'
import { elements } from 'element-r'
import { capitalize } from '../../../utils'
const { div, input, label } = elements

// { id, key, value, type, onEdit, onDrag, onDelete }
export const Item = (props) => {
  const isEdit = props.state === 'edit'
  const showLabel = props.state === 'edit' && props.showLabel
  const buildOpts = isEdit
    ? { 
      type: input,
      keyVal: '',
      editCls: `item-edit`,
      keyAttrs: {
        class: `item-key item-data item-edit`,
        type: props.keyInput || 'text',
        value: props.key,
        name: `key-${props.key}`
      },
      valAttrs: {
        class: `item-value item-data item-edit${props.cleave && ` item-cleave` || ''}`,
        type: props.valueInput || 'text',
        name: `value-${props.key}`
      }
    }
    : {
      type: div,
      keyVal: `${props.key}:`,
      editCls: '',
      keyAttrs: { class: `item-key item-data` },
      valAttrs: { class: `item-value item-data` }
    }
  
  
  return div({ className: `item ${buildOpts.editCls}` },
    showLabel && label(
      { className: 'item-key-label', for: buildOpts.keyAttrs.name }, 'Key'
    ) || null,
    buildOpts.type(buildOpts.keyAttrs, buildOpts.keyVal),
    showLabel && label(
      { className: 'item-value-label', for: buildOpts.valAttrs.name }, 'Value'
    ) || null,
    buildOpts.type(buildOpts.valAttrs, props.value),
    div({ className: `item-btns item-data` },
      Buttons(props),
    )
  )
}