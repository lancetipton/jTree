import BaseType from '../base'
import {
  typesOverride,
  capitalize,
  clearObj,
  isObj,
  updateParentHeights,
} from 'jTUtils'
import { Schema, Values } from 'jTConstants'
import { List } from '../../components'

class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

  constructor(config){
    super({ ...config })
  }
  
  styles = { closed: {}, open: {} }
  
  onToggle = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    if(!id) return

    const schema = Editor.schema(id)
    const update = { open: !schema.open }
    if(!update.open){
      this.setStyle(schema.component, this.styles.closed)
      return setTimeout(() => Editor.update(id, update), 500)
    }
    
    Editor.update(id, update)
  }
  
  setStyle = (domEl, styles) => (
    domEl && isObj(styles) && Object
    .entries(styles)
    .map(([ rule, value ]) => domEl.style[rule] = value)
  )
  
  setClosedHeight = schema => {
    const refNode = schema.component
    if(!refNode || refNode.style.maxHeight) return
    
    this.styles.closed.maxHeight = this.styles.closed.maxHeight || `${refNode.scrollHeight}px`

    this.setStyle(refNode, this.styles.closed)
  }
  
  setOpenHeight = schema => {
    const refNode = schema.component
    if(!schema.open || !refNode) return

    const childsHeight = Array
      .from(refNode.firstChild.children)
      .reduce((height, child) => {
        height+= child.scrollHeight || 0
        return height
      }, 0)
    
    const { closed } = this.styles
    const initHeight = parseInt(closed.maxHeight, 10)
    const openHeight = initHeight + childsHeight
    this.styles.open.maxHeight = `${openHeight}px`
    this.setStyle(refNode, this.styles.open) 
    updateParentHeights(schema.parent, openHeight)
  }
  
  componentDidMount = (props, Editor) => (
    props.parent && this.setClosedHeight(props.schema)
  )
  
  componentDidUpdate = (props, Editor) => {
    const { schema } = props
    const refNode = schema.component
    
    if(refNode && refNode.firstChild){
      this.styles.closed.maxHeight = `${refNode.firstChild.scrollHeight}px`
      this.setStyle(refNode, this.styles.closed)
    }

    this.buildEvents(schema, refNode)
    const { parent, instance, component, ...original } = schema
    this.original = original
    // Clear out the updated, because the component just updated
    this.updated && clearObj(this.updated)
    
    props.schema.open && this.setOpenHeight(schema)
  }

  onAdd = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    const schema = id && Editor.schema(id)
    schema && Editor.add({
      parent: schema,
      matchType: 'empty',
      key: Schema.JT_EMPTY_TYPE,
      value: undefined,
    })
  }

  render = props => {

    const { schema: { id, key, value, mode, matchType }, children } = props
    const isRoot = props.schema.key === Schema.ROOT
    const isOpen = props.schema.open
    const classes = isOpen && `list-open` || ''
    let actions = { onToggle: this.onToggle }
    
    actions = isOpen && mode !== Schema.MODES.EDIT && {
      ...actions,
      onAdd: this.onAdd,
    } || actions
    
    return List({
      id,
      key,
      value,
      mode,
      classes,
      isOpen,
      isRoot,
      styles: {
        wrapper: this.styles.closed,
      },
      children,
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      keyInput: 'text',
      ...this.getActions(mode, actions),
    })
  }


}

export default MapType