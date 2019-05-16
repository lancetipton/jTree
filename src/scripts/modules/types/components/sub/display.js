import { Values } from 'jTConstants'
import { elements } from 'element-r'

const getValue = (val, text) => {
  return text
    ? text
    : (val || val === 0 || val === '')
      ? (val + '').toString()
      : ''
}

export const display = (props, type) => {

  const keyVal = type === 'key' && getValue(props.key, props.keyText) || ''
  const elValue = type === 'value' && getValue(props.value, props.valueText) || ''

  return {
    keyVal,
    elValue,
    editCls: '',
    El: elements.div,
    [`${type}Attrs`]: { class: `item-${type} item-data` }
  } 
}