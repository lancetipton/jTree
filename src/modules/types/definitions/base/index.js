import { buildTheme } from '../../styles/build_theme'
import { Values, Schema } from 'jTConstants'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { isFunc, logData, clearObj } from 'jTUtils'

const noId = e => (
  logData(`Element id not found from event`, e, 'error') || false
)

const updateParentConstruct = (config, parent) => {
  Object.entries(Values.PARENT_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && parent[key] !== config[key])
      parent[key] = config[key]
  })
}

const addCustomEvents = (config, userEvents) => (
  Object
    .keys(Values.CUSTOM_EVENTS)
    .map(key => (
      userEvents[key] = isFunc(config[key]) && config[key] || Values.CUSTOM_EVENTS[key]
    ))
)

const addAllowedConfigOpts = config => (
  Values.TYPES_CONFIG_OPTS
    .reduce((typeConf, opt) => (
      (opt in config)  && (typeConf[opt] = config[opt]) || typeConf), {}
    )
)

const callEditor = (e, update, usrEvent, type, Editor) => {
  e && e.stopPropagation()
  const id = shouldDoDefault( e, update, Editor, usrEvent )
  id && Editor[type] && Editor[type](id, update)
}

const shouldDoDefault = (e, update, Editor, userEvent) => {
  const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
  return !id
    ? noId()
    : userEvent && userEvent(e, update, id, Editor) === false || id
}

const updateValue = (update, input, value) => {
  // Check input type, and if it has the CLEAVE_CLS
  // Which means is should be a number
  if(input.nodeName === 'INPUT' && input.classList.contains(Values.NUMBER_CLS)){
    // Check if the input should be a number
    const numVal = Number(value)
    // If it's a valid number use that instead
    !isNaN(numVal) && (update.value = numVal)
  }
  // Check if the original is a boolean, if the value is a string boolean version
  else if(typeof update.original === 'boolean' && (value === 'false' || value === 'true'))
    update.value = value === 'true'
  // Just set the value to update if none of the above
  else update.value = value

}

const togglePastAction = type => (
  Array
    .from(document.querySelectorAll(`.${Values.PASTE_ACTION_CLS}`))
    .map(node => {
      node && node.classList && node.classList[type](Values.SHOW_PASTE_CLS)
    })
)

class BaseType {

  static priority = 0
  static matchHelper = () => {}
  static eval = (value) => true
  static defaultValue = (newType, schema, settings) => ''
  static getStyles = (settings) => buildTheme(settings)
  static error = ({ message }) => (message || `Invalid input format`)

  constructor(config, Editor){
    if(!config) return

    updateParentConstruct(config, this.constructor)
    addCustomEvents(config, this.userEvents)
    this.config = addAllowedConfigOpts(config) || {}
  }

  userEvents = {}
  updated = {}
  original = {}

  onChange = (e, Editor) => {
    const input =  e.target || e.currentTarget
    // Get the key for the input
    const key = input && input.getAttribute(Values.DATA_SCHEMA_KEY)
    if(!key || !input) return

    // Get the values to compare
    const original = this.original[key]
    const value = input.value
    // Build our update object
    const update = { key, original }
    // Set the value to update
    updateValue(update, input, value)
    // Ensure these was a change, before we call the update
    if(original === update.value) return

    // Check if the input width should be update to match the value
    update.value &&  this.config.expandOnChange !== false && this.setWidth(input)
    // Call the userEvent to check if it should be updated
    // Then update the value locally
    // When the save action is called, this value will then be saved to the tree
    if(this.userEvents.onChange(e, update, this.original.id, Editor) !== false)
      this.updated[update.key] = update.value
  }

  onCancel = (e, Editor) => {
    e.stopPropagation()

    const update = { mode: undefined, value: this.original.value }
    const id = shouldDoDefault( e, update, Editor, this.userEvents.onCancel )
    if(!id) return

    // Check the pending, if true, that means cancel was pressed
    // Without the key / value ever being saved, so remove the item
    const schema = Editor.schema(id)
    schema && schema.pending
      ? Editor.remove(id)
      : Editor.update(id, update)
  }

  onSave = (e, Editor) => {
    callEditor(
      e,
      { ...this.updated, mode: undefined },
      this.userEvents.onSave,
      'update',
      Editor
    )
  }

  onEdit = (e, Editor) => {
    callEditor(
      e,
      { mode: Schema.MODES.EDIT },
      this.userEvents.onEdit,
      'update',
      Editor
    )
  }

  onDrag = (e, Editor) => {
    callEditor(
      e,
      { mode: Schema.MODES.DRAG },
      this.userEvents.onDrag,
      'update',
      Editor
    )
  }
  
  onDelete = (e, Editor) => {
    callEditor(
      e,
      { mode: Schema.MODES.REMOVE },
      this.userEvents.onDelete,
      'remove',
      Editor
    )
  }
  
  onCopy = (e, Editor) => {
    e && e.stopPropagation()
    const id = shouldDoDefault(
      e,
      { mode: Schema.MODES.REMOVE },
      Editor,
      this.userEvents.onCopy,
    )

    if(!id) return

    Editor.temp = id
    togglePastAction('add')
  }

  onCut = (e, Editor) => {
    e && e.stopPropagation()
    const update = { mode: Schema.MODES.CUT }
    const id = shouldDoDefault(
      e,
      update,
      Editor,
      this.userEvents.onCut,
    )

    if(!id) return
    
    Editor.temp = id
    togglePastAction('add')
    Editor.remove && Editor.update(id, update)
  }

  onPaste = (e, Editor) => {
    e && e.stopPropagation()
    const schema = Editor.schema(e.currentTarget.getAttribute(Values.DATA_TREE_ID))

    Editor.replaceAtPos(schema.id, { ...Editor.temp })
    Editor.temp = undefined
    togglePastAction('remove')
  }
  
  toggleActions = (e, Edtior) => {
    e && e.stopPropagation()
    const dropList = e.currentTarget.parentNode.parentNode.nextSibling
    if(!dropList) return

    dropList.classList.toggle('open')
  }
  
  shouldDoDefault = (...args) => shouldDoDefault(...args)
  
  getActions = (mode, extra) => (
    mode !== Schema.MODES.EDIT
      ? {
        onEdit: this.onEdit,
        onCopy: this.onCopy,
        onCut: this.onCut,
        onPaste: this.onPaste,
        onDrag: this.onDrag,
        onDelete: this.onDelete,
        toggleActions: this.toggleActions,
        ...extra
      }
      : {
        onChange: this.onChange,
        onSave: this.onSave,
        onCancel: this.onCancel,
        ...extra
      }
  )

  setWidth = input => (
    input &&
      input.value &&
      (input.style.width = `${input.value.length}ch`)
  )

  buildEvents = (schema, domNode) => (
    domNode && ['input', 'select', 'textarea']
      .map(tag => (
        Array.from(domNode.getElementsByTagName(tag))
          .map(input => {
            input.oninput = this.onChange
            this.config.expandOnChange !== false && this.setWidth(input)
          })
      ))
  )

  setOriginal = schema => {
    this.buildEvents(schema, schema.domNode)
    const { parent, instance, domNode, ...original } = schema
    this.original = original
  }

  componentDidMount = (props, Editor) => {
    this.setOriginal(props.schema)
  }

  componentDidUpdate = (props, Editor) => {
    this.setOriginal(props.schema)
    // Clear out the updated, because the component just updated
    this.updated && clearObj(this.updated)
  }

  shouldComponentUpdate = (params) => {
    return true
  }

  componentWillUnmount = (Editor) => {
    // Set to undefined, because when the instance gets remove, we don't want it 
    // to remove the value; because it's a ref to the actual value in the tree
    this.original.value = undefined
  }

  render = props => {
    return ''
  }
  
}


export default BaseType