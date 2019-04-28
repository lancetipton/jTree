import BaseType from '../base'
import { typesOverride } from '../../../../utils'
import { createEditBtns } from '../../helpers'
import { er, elements } from 'element-r'
const { div, br, span } = elements

class StringType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'string')

  constructor(config){
    super(config)
    typesOverride(this, config)
  }

  onEdit = e => {
    console.log('------------------on edit------------------');
    console.log(this);
  }

  onDrag = e => {
    console.log('------------------on drag------------------');
    console.log(this);
  }

  onDelete = e => {
    console.log('------------------on delete------------------');
    console.log(this);
  }

  build = (params) => {
    // console.log('------------------params------------------');
    // console.log(params.schema);
  }

  render = props => {
    const { schema: { id }, schema } = props
    return div({ className: `string-wrapper item-wrapper` },
      span({ className: 'string-key' }, `${props.schema.key}`),
      span({ className: 'string-value' }, `${props.schema.value}`),
      div({ className: `btns-wrapper` },
        createEditBtns({
          id,
          type: 'String',
          edit: this.onEdit,
          drag: this.onDrag,
          delete: this.onDelete,
        }),
      )
    )
  }

}

export default StringType