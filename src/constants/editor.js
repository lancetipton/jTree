const NO_OP = () => {}
export const EditorConfig = Object.freeze({
  onChange: NO_OP,
  onSave: NO_OP,
  onCancel: NO_OP,
  source: undefined,
  confirmActions: true,
  iconType: 'far',
  styles: {},
  root: {
    start: 'closed',
    title: 'Object Tree'
  }
})