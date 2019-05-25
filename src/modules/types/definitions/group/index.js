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
    e.stopPropagation()
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    if(!id) return

    const schema = Editor.schema(id)
    // If no schema just return, cause we cant update
    if(!schema) return

    const update = { open: !schema.open }

    // --- Does the opposite of the didUpdate method below --- //
    // Check if the store is open, but the update is changing to closed
    if(this.store.isOpen && !update.open){
      // If true, close the object before the update is called
      this.store.isOpen = false
      
      const refNode = schema.component
      // First update the maxHeight, to `close the object`
      refNode.style.maxHeight = this.store.closedMaxHt
      // Use a timeout to wait until the object is closed
      return setTimeout(() => {
        // Then update the store, can call the update method
        // Now the object have been closed
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
    if(!refNode || refNode.style.maxHeight) return

    // Set the currentMax height
    this.store.currentMaxHt = `${refNode.scrollHeight}px`
    this.store.closedMaxHt = this.store.currentMaxHt
    refNode.style.maxHeight = this.store.currentMaxHt

    // If it's the root node, it defaults to open
    if(props.schema.isRoot && props.schema.open){
      this.store.isOpen = true
    // So use the header child height to set the default closed height
      const rootHeader = document.getElementById(Values.JT_ROOT_HEADER_ID)
      if(!rootHeader) return
      this.store.closedMaxHt = `${rootHeader.scrollHeight}px`

    }

    this.getTransSpeed(refNode)
  }

  componentDidUpdate = (props, Editor) => {
    const { schema } = props

    this.setOriginal(schema)

    // Clear out the updated, because the component just updated
    this.updated && clearObj(this.updated)
    
    // ----- height update ----- //
    // If no comp || not open just return
    const refNode = schema.component
    if(!refNode) return
    
    const childrenHt = getChildrenHt(refNode)

    // --- Does the opposite of the toggle method above --- //
    // Check if the schema is open, but the local store is closed
    if(!this.store.isOpen && schema.open){
    // If true, set the store to open, and update the maxHeight of the element
      this.store.isOpen = true
      this.store.currentMaxHt = `${childrenHt}px`
      // Only set in open, so it keeps the height when about to close
      refNode.style.maxHeight = this.store.currentMaxHt
    }

    // If the schema is open, update all the parent heights
    // This ensures the parent height does not cut off the children
    // when a child grows larger
    (schema.mode === Schema.MODES.EDIT || schema.open) &&
      updateParentHeights(schema, childrenHt)
  }


  onAdd = (e, Editor) => {
    e.stopPropagation()

    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    const schema = id && Editor.schema(id)
    const update = {
      parent: schema,
      mode: Schema.MODES.ADD,
      matchType: Schema.EMPTY,
    }

    if(Array.isArray(schema.value))
      update.key = schema.value.length
    
    schema && Editor.add({
      parent: schema,
      mode: Schema.MODES.ADD,
      matchType: Schema.EMPTY,
    })
  }

  render = props => {

    const {
      schema: {
        id, key, value, mode, matchType, keyType, keyText, isRoot, open, error
      },
      children,
    } = props
    const notEditMode = mode !== Schema.MODES.EDIT
    const classes = open && `list-open` || ''
    let actions = {}
    if(notEditMode) actions.onToggle = this.onToggle
    if(open && notEditMode) actions.onAdd = this.onAdd

    return List({
      id,
      key,
      value,
      mode,
      classes,
      isRoot,
      children,
      keyText,
      error,
      showPaste: props.settings.Editor.hasTemp(),
      keyType: keyType || 'text',
      isOpen: open,
      styles: {
        // Always set the height to be the currentMax height
        // When opened, height will be updated in componentDidUpdate
        wrapper: { maxHeight: this.store.currentMaxHt },
      },
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      keyEdit: !props.schema.parent || !Array.isArray(props.schema.parent.value),
      ...this.getActions(mode, actions),
    })
  }

}

export default GroupType