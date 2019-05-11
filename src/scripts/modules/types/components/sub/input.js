import { Values } from 'jTConstants'
import { elements } from 'element-r'
import { label } from './label'
import { capitalize } from 'jTUtils'
/**
 * Gets the attributes for the input element, based on the passed in type
 * @param  { object } props - data passed in from TypeClass instance
 * @param  { string } type - which property the input is being built for ( key || value )
 * 
 * @return { dom node }
 */
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
 * Wraps an input element to help with styling and placement ( i.e. position: relative )
 * @param  { object } props - attributes for the wrapper and type of data being wrapped
 * @param  { any } children - sub elements of the wrapper
 * 
 * @return { dom node }
 */
export const inputWrapper = (props, children) => {
  let { type, showLabel, classes, ...attrs } = props
  classes = classes && `${classes} item-data-wrapper` || 'item-data-wrapper' 
  if(type) classes += ` item-${type}-wrapper`

  return elements.div(
    { ...attrs, className: classes }, 
    showLabel && label(type, capitalize(type)),
    children
  )
}


/**
 * Builds an input object based on passed in params
 * @param  { object } props - data passed in from TypeClass instance
 * @param  { object } props.showLabel - should show input label
 * @param  { object } props.value - value of the element
 * @param  { object } props.valueInput - value input type if editing
 * @param  { object } props.key - key being edited
 * @param  { object } props.keyInput - key input type if editing
 * @param  { string } type - which property the input is being built for ( key || value )
 * 
 * @return { object } - object with properties used to create an input domNode
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