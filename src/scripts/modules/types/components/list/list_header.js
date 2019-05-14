import { Buttons, Icon } from '../buttons'
import { elements } from 'element-r'
import { capitalize } from 'jTUtils'
import { Values, Schema } from 'jTConstants'
import * as subComps from '../sub'
const { div } = elements

const buildKeyEl = ({ showLabel, El, keyAttrs, keyVal }) => {
  const keyEl = El(keyAttrs, keyVal)
  return !showLabel
    ? keyEl
    : div({ className: 'item-data-wrapper item-key-wrapper' },
      subComps.label(keyAttrs.name, 'Key'),
      keyEl
    )
}

const buildHeaderKey = (props, toggleProps) => {
  const { key, keyType, mode } = props

  return props.mode !== Schema.MODES.EDIT
    ? div({
        className: 'item-key item-data',
        ...toggleProps,
      }, `${key}:`)
    : buildKeyEl(
        subComps.input({
        key,
        value: key,
        keyType: keyType || 'text',
        showLabel: true,
      }, 'key')
    )
}

export const ListHeader = props => {
  const { id, key, value, type, isOpen } = props
  const iconCls = isOpen && `open` || ``
  const rootCls = key === Schema.ROOT
    ? 'root'
    : ''
  
  const classes = `${iconCls} ${rootCls} header item ${props.mode === Schema.MODES.EDIT && Values.EDIT_CLS || ''}`

  const toggleProps = {
    onClick: props.onToggle,
    [Values.DATA_TREE_ID]: id,
  }

  return div({ className: classes },
    Icon(null, null, {
      icon: {
        className: `icon toggle-icon fas fa-angle-right ${iconCls}`,
        title: `Toggle open / closed`,
        ...toggleProps,
      }
    }),
    buildHeaderKey(props, toggleProps),
    div(
      {
        className: 'item-value item-data',
        ...toggleProps,
      },
      `${capitalize(type)}`
    ),
    !rootCls && div({ className: `item-btns item-data` }, Buttons(props)) || null
  )
}