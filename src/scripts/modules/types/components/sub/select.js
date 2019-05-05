import { Values } from 'jTConstants'
import { elements } from 'element-r'

const getChildren = props => (
  props.options && props.options.map(option => (
    typeof option === 'string'
      ? elements.option({ value: option, className: 'item-option' }, option)
      : elements.option(
        { value: option.value, className: 'item-option' },
        option.text || option.value
      )
  ))
)

const selectWrapper = (props, children) => (
  elements.div({className: 'select-wrapper'},
    elements.select(props, children),
    elements.i({className: 'fas fa-sort select-icon'}), 
  )
)

export const select = (props, type) => ({
  El: selectWrapper,
  isEdit: true,
  showLabel: props.showLabel,
  keyVal: '',
  editCls: Values.EDIT_CLS,
  elValue: props.value,
  [`${type}Attrs`]: {
    class: `item-${type} item-data ${Values.EDIT_CLS}`,
    [Values.DATA_SCHEMA_KEY]: type,
    name: `${type}-${props.key}`,
    value: props[type],
  },
  children: getChildren,
  options: Array.isArray(props.options) && props.options || [],
})