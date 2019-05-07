import { Values } from 'jTConstants'
import { elements } from 'element-r'

const getAttrs = (props, type) => (
  type == 'key'
    ? {
      class: `item-key item-data ${Values.EDIT_CLS}`,
      type: props.keyInput || 'text',
      value: props.key,
      [Values.DATA_SCHEMA_KEY]: type,
      name: `key-${props.key}`
    }
    : {
      class: `item-value item-data ${Values.EDIT_CLS} ${props.cleave && Values.CLEAVE_CLS || ''}`,
      type: props.valueInput || 'text',
      [Values.DATA_SCHEMA_KEY]: type,
      name: `value-${props.key}`,
      value: props.value,
    }
)
/**
 * 
 * 
 * @param  { object } props - data passed in from TypeClass instance
 * @param  { object } props.showLabel - should show input label
 * @param  { object } props.value - value of the element
 * @param  { object } props.valueInput - value input type if editing
 * @param  { object } props.key - key being edited
 * @param  { object } props.keyInput - key input type if editing
 * @return { dom node }
 */
export const input = (props, type) => ({ 
    El: elements.input,
    isEdit: true,
    showLabel: props.showLabel,
    keyVal: '',
    editCls: Values.EDIT_CLS,
    elValue: props.value,
    [`${type}Attrs`]: getAttrs(props, type)
})