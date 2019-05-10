import BaseType from '../base'
import { Item } from '../../components'
import { Values, Schema } from 'jTConstants'

class EmptyType extends BaseType {

  static priority = 1
  static eval = (value) => (value === undefined)

  constructor(config){
    super({ ...config })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType } } = props

    return Item({
      id,
      key: '',
      value: '',
      mode: Schema.MODES.EDIT,
      type: 'empty',
      showLabel: true,
      keyInput: 'text',
      ...this.getActions(Schema.MODES.EDIT)
    })
  }

}

export default EmptyType