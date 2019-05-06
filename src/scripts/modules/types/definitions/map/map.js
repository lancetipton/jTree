import BaseType from '../base'
import { typesOverride, capitalize } from 'jTUtils'
import { Values } from 'jTConstants'
import { List } from '../../components'

class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

   constructor(config){
     super({ ...config })
   }
  
  onToggle = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    const schema = Editor.schema(id)
    const update = schema.mode !== 'OPEN'
      ? { mode: 'OPEN' }
      : { mode: undefined }

    id && Editor.update(id, update)
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType }, children } = props
    const isRoot = props.schema.key === Values.ROOT
    // const isOpen = props.schema.open || isRoot
    const isOpen = props.schema.mode === 'OPEN'
    let classes = `list-wrapper`
    classes += isOpen && ` list-open` || ''
    
    return List({
      id,
      key,
      value,
      mode,
      classes,
      isOpen,
      isRoot,
      children,
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      keyInput: 'text',
      ...this.getActions(mode),
      onToggle: this.onToggle
    })
  }


}

export default MapType