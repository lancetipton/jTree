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
    destroyOnSave: true,
    destroyOnCancel: true,
    changeDebounce: 50,
    iconType: 'far',
    styles: {},
    popper: {
      eventsEnabled: false,
      removeOnDestroy: true,
      placement: 'bottom-start',
      modifiers: {},
    }
  }
})