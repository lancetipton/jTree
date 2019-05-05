import { Values } from './values'

export const DEF_SETTINGS =  Object.freeze({
  types: {
    base: {},
    undefined: {},
    number: {},
    map: {},
    collection: {},
    string: {},
  },
  customTypes: {},
  editor: {
    onChange: Values.NO_OP,
    onSave: Values.NO_OP,
    onCancel: Values.NO_OP,
    source: undefined,
    iconType: 'far',
    styles: {}
  }
})