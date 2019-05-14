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

const getChildrenHt = refNode => {
  return Array
    .from(refNode.firstChild.children)
    .reduce((height, child) => {
      height+= child.scrollHeight || 0
      return height
    }, 0)
}

class GroupType extends BaseType {

  constructor(config){
    super(config)
  }

  store = {}

  onToggle = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    if(!id) return

    const schema = Editor.schema(id)
    if(!schema) return

    const update = { open: !schema.open }
    if(this.store.isOpen && !update.open){
      this.store.isOpen = false
      
      const refNode = schema.component

      refNode.style.maxHeight = this.store.closedMaxHt
      return setTimeout(() => {
        this.store.currentMaxHt = this.store.closedMaxHt
        Editor.update(id, update)
      }, this.toggleSpeed || 500)
    }
    
    Editor.update(id, update)
  }
  
  getTransSpeed = refNode => {
    refNode = refNode || props.schema.component

    if(!refNode) return

    const transRule = window.getComputedStyle(refNode).transition
    if(!transRule) return
    // Convert the transition rule speed into milliseconds
    const speed = parseFloat(transRule.split(' ')[1]) * 1000
    if(typeof speed !== 'number' || isNaN(speed)) return
    this.toggleSpeed = speed
  }
  
  componentDidMount = (props, Editor) => {
    const refNode = props.schema.component
    if(!props.schema.parent || !refNode || refNode.style.maxHeight) return
    
    // Set the currentMax height
    this.store.currentMaxHt = `${refNode.scrollHeight}px`
    this.store.closedMaxHt = this.store.currentMaxHt
    refNode.style.maxHeight = this.store.currentMaxHt
    this.getTransSpeed(refNode)
  }

  componentDidUpdate = (props, Editor) => {
    const { schema } = props
    this.setOriginal(schema)
    // Clear out the updated, because the component just updated
    this.updated && clearObj(this.updated)

    // ----- height update
    // If no comp || not open just return
    const refNode = schema.component
    if(!refNode) return
    
    const childrenHt = getChildrenHt(refNode)

    if(!this.store.isOpen && schema.open){
      this.store.isOpen = true
      this.store.currentMaxHt = `${childrenHt}px`
      // Only set in open, so it keeps the height when about to close
      refNode.style.maxHeight = this.store.currentMaxHt
    }

    schema.parent && updateParentHeights(schema, childrenHt)
  }


  onAdd = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    const schema = id && Editor.schema(id)
    schema && Editor.add({
      parent: schema,
      mode: Schema.MODES.ADD,
      matchType: Schema.EMPTY,
    })
  }

  render = props => {
    const { schema: { id, key, value, mode, matchType, keyType }, children } = props

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
      children,
      keyType: keyType || 'text',
      styles: {
        // Always set the height to be the currentMax height
        // When opened, height will be updated in componentDidUpdate
        wrapper: { maxHeight: this.store.currentMaxHt },
      },
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      ...this.getActions(mode, actions),
    })
  }

}

export default GroupType