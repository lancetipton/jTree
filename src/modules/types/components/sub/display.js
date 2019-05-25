import { Values } from 'jTConstants'
import { elements } from 'element-r'

const getValue = (val, text, prefix='') => {
  return text
    ? `${prefix}${text}`
    : (val || val === 0 || val === '')
      ? `${prefix}${(val + '').toString()}`
      : ''
}

export const display = (props, type) => {

  const keyVal = type === 'key'
    ? getValue(props.key, props.keyText, props.keyPrefix)
    : ''
  const elValue = type === 'value'
    ? getValue(props.value, props.valueText, props.valPrefix)
    : ''

  return {
    keyVal,
    elValue,
    editCls: '',
    El: elements.div,
    [`${type}Attrs`]: { class: `item-${type} item-data` }
  } 
}