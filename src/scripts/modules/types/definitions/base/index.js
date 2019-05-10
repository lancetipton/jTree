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

const shouldDoDefault = (e, update, Editor, userEvent) => {
  const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
  return !id
    ? noId()
    : userEvent && userEvent(e, update, id, Editor) === false || id
}

const addAllowedConfigOpts = config => (
  Values.TYPES_CONFIG_OPTS
    .reduce((typeConf, opt) => (
      (opt in config)  && (typeConf[opt] = config[opt]) || typeConf), {}
    )
)

let STYLES_LOADED
class BaseType {

  static priority = 0
  static matchHelper = () => {}
  static eval = (value) => (typeof value === 'string')

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
    const value = input.value
    const key = input.getAttribute(Values.DATA_SCHEMA_KEY)

    if(
      (value === undefined || key === undefined) ||
      (this.original[key] && this.original[key] === value)
    ) return
    
    value &&  this.config.expandOnChange !== false && this.setWidth(input)
    const update = { key, value, original: this.original[key] }

    return (this.userEvents.onChange(e, update, this.original.id, Editor) !== false) && 
      ( this.updated[key] = update.value )
  }

  onSave = (e, Editor) => {
    const update = { ...this.updated, mode: undefined }
    const id = shouldDoDefault( e, update, Editor, this.userEvents.onSave )
    id && Editor.update(id, update)
  }

  onCancel = (e, Editor) => {
    const update = { mode: undefined, value: this.original.value }
    const id = shouldDoDefault( e, update, Editor, this.userEvents.onCancel )
    id && Editor.update(id, update)
  }

  onEdit = (e, Editor) => {
    const update = { mode: Schema.MODES.EDIT }
    const id = shouldDoDefault( e, update, Editor, this.userEvents.onEdit )
    id && Editor.update(id, update)
  }

  onDrag = (e, Editor) => {
    const update = { mode: Schema.MODES.DRAG }
    const id = shouldDoDefault( e, update, Editor, this.userEvents.onEdit )
    id && Editor.update(id, update)
  }

  onDelete = (e, Editor) => {
    const update = { id, mode: Schema.MODES.DRAG }
    const id = shouldDoDefault( e, update, Editor, this.userEvents.onDelete )
    id && Editor.remove(id)
  }

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

  componentDidUpdate = (props, Editor) => {
    const { schema } = props
    
    this.buildEvents(schema, schema.component)
    const { parent, instance, component, ...original } = schema
    this.original = original
    // Clear out the updated, because the component just updated
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
    const actions = schema.mode !== Schema.MODES.EDIT
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