import { Buttons, Icon } from '../buttons'
import { elements } from 'element-r'
import { capitalize } from 'jTUtils'
import { Values } from 'jTConstants'
const { div, a } = elements

export const ListHeader = props => {
  const { id, key, value, type, isOpen } = props
  const iconCls = isOpen && `open` || ``

  return div({ className: `header item` },
    Icon(null, null, {
      icon: {
        className: `icon list-toggle-icon fas fa-angle-right ${iconCls}`,
        title: `Toggle open / closed`,
        onClick: props.onToggle,
        [Values.DATA_TREE_ID]: id,
      }
    }),
    div({ className: 'item-key item-data' }, `${key}:`),
    div({ className: 'item-value item-data' }, `${capitalize(type)}`),
    div({ className: `item-btns item-data` }, Buttons(props))
  )
}