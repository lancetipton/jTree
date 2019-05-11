import { Buttons } from './buttons'
import { elements } from 'element-r'
import { capitalize, isFunc } from 'jTUtils'
import { Values, Schema } from 'jTConstants'
import * as subComps from './sub'
const { div, i } = elements

/**
 * Build the input options based on props.mode and type
 * @param  { object } props - Data return from the sub component input type
 * @param  { string } type - One of key or value
 * @return { object } built options 
 */
const buildOptions = (props, type) => {
  const isEdit = props.mode === Schema.MODES.EDIT
  const showLabel = isEdit && props.showLabel
  const typeEl = props[`${type}El`]
  return !isEdit 
    ? subComps.display(props, type)
    : typeEl && subComps[typeEl]
      ? subComps[typeEl](props, type)
      : subComps.input(props, type)
}

/**
 * Build the key input, key editing should always be a string
 * @param  { object } props - data return from the sub component input type
 * @return { dom node }
 */
const buildItemKey = ({ showLabel, El, keyAttrs, keyVal }, props) => {
  const keyEl = El(keyAttrs, keyVal)
  return !showLabel
    ? keyEl
    : div({ className: 'item-data-wrapper item-key-wrapper' },
      subComps.label(keyAttrs.name, 'Key'),
      keyEl
    )
}

/**
 * Build the value input
 * Checks for children method || use elValue, used for Select || Input dom nodes
 * @param  { object } props - data return from the sub component input type
 * @return { dom node }
 */
const buildItemValue = (itemProps, props) => {
  const { showLabel, El, valueAttrs, elValue, children } = itemProps
  if(props && props.type === 'empty') valueAttrs.disabled = true
  const valEl = El(valueAttrs, isFunc(children) && children(itemProps) || elValue)
  
  return !showLabel
    ? valEl
    : div({ className: 'item-data-wrapper item-value-wrapper' },
      subComps.label(valueAttrs.name, 'Value'),
      valEl,
    )
}

/**
 * Builds item based on passed in props
 * Build item children including key / value inputs, and action based on props.mode
 * @param  { object } props - passing in from the Types render method
 * @return { dom node }
 */
export const Item = (props) => {
  let classes = `item ${props.mode === Schema.MODES.EDIT && Values.EDIT_CLS || ''}`
  
  if(props && props.type === 'empty')
    classes += ` item-empty`
    
  return div(
    { className: classes },
    buildItemKey(buildOptions(props, 'key'), props),
    buildItemValue(buildOptions(props, 'value'), props),
    div(
      { className: `item-btns item-data` },
      Buttons(props),
    )
  )
}
