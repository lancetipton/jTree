import { Values } from './values'

export const EditorConfig = Object.freeze({
  onChange: Values.NO_OP,
  onSave: Values.NO_OP,
  onCancel: Values.NO_OP,
  source: undefined,
  confirmActions: true,
  iconType: 'far',
  styles: {},
  root: {
    start: 'closed',
    title: 'Object Tree'
  }
})