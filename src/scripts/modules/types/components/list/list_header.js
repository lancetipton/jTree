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

const buildHeaderKey = props => {
  const { key } = props

  return props.mode !== Schema.MODES.EDIT
    ? div({ className: 'item-key item-data' }, `${props.key}:`)
    : buildKeyEl(
        subComps.input({
        key: props.key,
        value: props.key,
        keyInput: 'text',
        showLabel: true,
      }, 'key')
    )
}

export const ListHeader = props => {
  const { id, key, value, type, isOpen } = props
  const iconCls = isOpen && `open` || ``
  return div({ className: `header item ${props.mode === Schema.MODES.EDIT && Values.EDIT_CLS || ''}` },
    Icon(null, null, {
      icon: {
        className: `icon list-toggle-icon fas fa-angle-right ${iconCls}`,
        title: `Toggle open / closed`,
        onClick: props.onToggle,
        [Values.DATA_TREE_ID]: id,
      }
    }),
    buildHeaderKey(props),
    div({ className: 'item-value item-data' }, `${capitalize(type)}`),
    div({ className: `item-btns item-data` }, Buttons(props))
  )
}