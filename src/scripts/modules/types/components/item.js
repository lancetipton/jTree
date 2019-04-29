import { Buttons } from './buttons'
import { elements } from 'element-r'
import { capitalize } from '../../../utils'
const { div } = elements

// { id, key, value, type, onEdit, onDrag, onDelete }
export const Item = (props) => {
  
  return div({ className: `item` },
    div({ className: 'item-key item-data' }, `${props.key}:`),
    div({ className: 'item-value item-data' }, `${props.value}`),
    div({ className: `item-btns item-data` },
      Buttons({
        id: props.id,
        type: props.type,
        edit: props.onEdit,
        drag: props.onDrag,
        delete: props.onDelete,
      }),
    )
  )
}