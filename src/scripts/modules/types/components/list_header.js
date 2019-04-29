import { Buttons } from './buttons'
import { elements } from 'element-r'
import { capitalize } from '../../../utils'
const { div } = elements

export const ListHeader = ({ id, key, value, type, onEdit, onDrag, onDelete }) => {
  
  return div({ className: `header item` },
    div({ className: 'item-key item-data' }, `${key}:`),
    div({ className: 'item-value item-data' }, `${capitalize(type)}`),
    div({ className: `item-btns item-data` },
      Buttons({
        id,
        type: type,
        edit: onEdit,
        drag: onDrag,
        delete: onDelete,
      }),
    )
  )
}