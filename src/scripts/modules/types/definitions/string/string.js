import BaseType from '../base'
import { typesOverride } from '../../../../utils'
import { div, br, span } from '../../../elementr'
import { createEditBtns } from '../../helpers'


const onEdit = function(e){
  console.log('------------------on edit------------------');
  console.log(this);
}

const onDrag = function(e){
  console.log('------------------on drag------------------');
  console.log(this);
}

const onDelete = function(e){
  console.log('------------------on delete------------------');
  console.log(this);
}

class StringType extends BaseType {

  static priority = 1
  static eval = (value) => (typeof value === 'string')
  
  constructor(config){
    super(config)
    typesOverride(this, config)
  }

  build = (params) => {
    // console.log('------------------params------------------');
    // console.log(params.schema);
  }

  render = props => {
    const { schema: { id }, schema } = props
    
    return div({ className: `string-div`, style: { maxWidth: '80%' } },
      ...createEditBtns({
        id,
        edit: onEdit.bind(this),
        drag: onDrag.bind(this),
        delete: onDelete.bind(this),
      }),
      span(`Key: ${props.schema.key}`),
      br(),
      span(`Value: ${props.schema.value}`)
    )
  }

}

export default StringType