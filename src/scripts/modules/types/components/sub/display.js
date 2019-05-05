import { Values } from 'jTConstants'
import { elements } from 'element-r'

export const display = (props, type) => ({ 
  El: elements.div,
  elValue: props.value,
  keyVal: `${props.key}:`,
  editCls: '',
  [`${type}Attrs`]: { class: `item-${type} item-data` }
})