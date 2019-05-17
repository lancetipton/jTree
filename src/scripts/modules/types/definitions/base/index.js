import { buildTheme } from '../../styles/build_theme'
import { Values, Schema } from 'jTConstants'
import { Item } from '../../components'
import Cleave from 'cleave.js'
import { isFunc, logData, clearObj } from 'jTUtils'

const customEvents = {
  onCancel: Values.NO_OP,
  onChange: Values.NO_OP,
  onEdit: Values.NO_OP,
  onDelete: Values.NO_OP,
  onDrag: Values.NO_OP,
  onSave: Values.NO_OP,
}

const noId = e =>
  logData(`Element id not found from event`, e, 'error') || false

const updateParentConstruct = (config, parent) => {
  Object.entries(Values.PARENT_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && parent[key] !== config[key])
      parent[key] = config[key]
  })
}

const addCustomEvents = (config, userEvents) => (
  Object
    .keys(customEvents)
    .map(key => (
      userEvents[key] = isFunc(config[key]) && config[key] || customEvents[key]
    ))
)

const addAllowedConfigOpts = config => (
  Values.TYPES_CONFIG_OPTS
    .reduce((typeConf, opt) => (
      (opt in config)  && (typeConf[opt] = config[opt]) || typeConf), {}
    )
)

const callEditor = (e, update, usrEvent, type, Editor) => {
  const id = shouldDoDefault( e, update, Editor, usrEvent )
  id && Editor[type] && Editor[type](id, update)
}

const shouldDoDefault = (e, update, Editor, userEvent) => {
  const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
  return !id
    ? noId()
    : userEvent && userEvent(e, update, id, Editor) === false || id
}

class BaseType {

  static priority = 0
  static matchHelper = () => {}
  static eval = (value) => (typeof value === 'string')
  static defaultValue = (newType, schema, settings) => ''
  static getStyles = (settings) => buildTheme(settings)
  
  constructor(config){
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
    const key = input.getAttribute(Values.DATA_SCHEMA_KEY)
    // Build our update object
    const update = {
      key,
      value: input.value,
      original: this.original[key]
    }
    // Check input type, and if it has the CLEAVE_CLS
    // Which means is should be a number
    if(input.nodeName === 'INPUT' && input.classList.contains(Values.NUMBER_CLS)){
      // Check if the input should be a number
      const numVal = Number(update.value)
      // If it's a valid number use that instead
      !isNaN(numVal) && (update.value = numVal)
    }
    
    // Ensure we have a valid key and value, and there was an update
    if(
      (update.value === undefined || update.key === undefined) ||
      (this.original[update.key] && this.original[update.key] === update.value) ||
      isNaN(update.value)
    ) return
    
    // Check if the input width should be update to match the value
    update.value &&  this.config.expandOnChange !== false && this.setWidth(input)
    // Call the userEvent to check if it should be updated
    // Then update the value locally
    // When the save action is called, this value will then be saved to the tree
    return (
      this.userEvents.onChange(e, update, this.original.id, Editor) !== false
      ) && ( this.updated[update.key] = update.value )
  }

  onCancel = (e, Editor) => {
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
  
  shouldDoDefault = (...args) => shouldDoDefault(...args)
  
  getActions = (mode, extra) => (
    mode !== Schema.MODES.EDIT
      ? {
        onEdit: this.onEdit,
        onDrag: this.onDrag,
        onDelete: this.onDelete,
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
    this.buildEvents(schema, schema.component)
    const { parent, instance, component, ...original } = schema
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

    const { schema } = props

    return Item({
      id: schema.id,
      key: schema.key,
      value: schema.value,
      mode: schema.mode,
      showLabel: true,
      type: schema.matchType,
      keyEdit: !schema.parent || !Array.isArray(schema.parent.value),
      keyType: schema.keyType || 'text',
      ...getActions(schema.mode)
    })
  }
  
}


export default BaseType