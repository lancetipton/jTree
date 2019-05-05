import { buildTheme } from '../../styles/build_theme'
import { Values } from 'jTConstants'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { isFunc, noOp, logData, clearObj } from 'jTUtils'

const customEvents = {
  onCancel: noOp,
  onChange: noOp,
  onEdit: noOp,
  onDelete: noOp,
  onDrag: noOp,
  onSave: noOp,
}

const noId = e =>
  logData(`Element id not found from event`, e, 'error') || false

const updateParentConstruct = (config, parent) => {
  Object.entries(Values.PARENT_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && parent[key] !== config[key])
      parent[key] = config[key]
  })
}

const addCustomEvents = (config, usrEvts) => (
  Object
    .keys(customEvents)
    .map(key => (
      usrEvts[key] = isFunc(config[key]) && config[key] || customEvents[key]
    ))
)

const shouldDoDefault = (e, Editor, usrEvt) => {
  const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
  return !id
    ? noId()
    : usrEvt && usrEvt(e, id, Editor) === false || id
}

let STYLES_LOADED
class BaseType {

  static priority = 0
  static matchHelper = () => {}
  static eval = (value) => (typeof value === 'string')

  static getStyles = (settings) => buildTheme(settings)
  
  constructor(config){
    if(!config) return

    updateParentConstruct(config, this.constructor)
    addCustomEvents(config, this.usrEvts)
  }

  usrEvts = {}
  updated = {}
  original = {}
  
  onChange = (e, Editor) => {
    const value = e.target && e.target.value || e.currentTarget && e.currentTarget.value
    const key = e.currentTarget.getAttribute(Values.DATA_SCHEMA_KEY)
    if(value && e.target)
      e.target.style.width = `${value.length}ch`

    if(
      (value === undefined || key === undefined) ||
      (this.original[key] && this.original[key] === value)
    ) return


    return (this.usrEvts.onChange(key, value, Editor) !== false) && 
      ( this.updated[key] = value )
  }

  onSave = (e, Editor) => {
    const id = shouldDoDefault( e, Editor, this.usrEvts.onSave )
    id && Editor.update(id, { ...this.updated, mode: undefined })
  }

  onCancel = (e, Editor) => {
    const id = shouldDoDefault( e, Editor, this.usrEvts.onCancel )
    id && Editor.update(id, { mode: undefined, value: this.original.value })
  }

  onEdit = (e, Editor) => {
    const id = shouldDoDefault( e, Editor, this.usrEvts.onEdit )
    id && Editor.update(id, { mode: Values.MODES.EDIT })
  }

  onDrag = (e, Editor) => {
    const id = shouldDoDefault( e, Editor, this.usrEvts.onEdit )
    id && Editor.update(id, { mode: Values.MODES.DRAG })
  }

  onDelete = (e, Editor) => {
    const id = shouldDoDefault( e, Editor, this.usrEvts.onDelete )
    id && Editor.remove(id)
  }

  buildEvents = (schema, domNode) => {
    if(!domNode || !domNode.tagName) return
    const isInput = domNode.tagName === 'INPUT'
    // Catches changes for the key input
    if(isInput) {
      domNode.oninput = this.onChange
      // Update the length of the input to match the value length
      domNode.value.length && (domNode.style.width = `${domNode.value.length}ch`)
    }
    
    !isInput && domNode.children.length && Array
      .from(domNode.children)
      .map(child => {
        (child.tagName === 'INPUT' || child.children.length)
        && this.buildEvents(schema, child) 
      })

    // Clear out domNode just so we don't have any memory leaks
    domNode = undefined
  }

  componentDidUpdate = (props, domEl, Editor) => {
    const { schema } = props
    
    this.buildEvents(schema, domEl)

    this.original = {
     value: schema.value,
     key: schema.key,
     mode: schema.mode,
     matchType: schema.matchType,
    }
    // Clear out the updated, because we just updated
    this.updated && clearObj(this.updated)
  }

  shouldComponentUpdate = (params) => {
    return true
  }

  componentWillUnmount = (Editor) => {
    clearObj(this.original)
    clearObj(this.updated)
  }

  render = props => {

    const { schema } = props
    const actions = schema.mode !== Values.MODES.EDIT
      ? {
        onEdit: this.onEdit,
        onDrag: this.onDrag,
        onDelete: this.onDelete
      }
      : {
        onChange: this.onChange,
        onSave: this.onSave,
        onCancel: this.onCancel,
      }

    return Item({
      id: schema.id,
      key: schema.key,
      value: schema.value,
      mode: schema.mode,
      showLabel: true,
      type: schema.matchType,
      keyInput: 'text',
      ...actions
    })
  }
  
}


export default BaseType