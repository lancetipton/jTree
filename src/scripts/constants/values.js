export const Values = Object.freeze({
  CLEAVE_CLS: 'item-cleave',
  DATA_SCHEMA_KEY: 'data-schema-key',
  DATA_TREE_ID: 'data-tree-id',
  DEFAULT_TYPES: 'definitions',
  EDIT_CLS: 'item-edit',
  LOG_TYPES: Object.freeze([
    'error',
    'dir',
    'log',
    'warn'
  ]),
  MAP_TYPES: 'MAP_TYPES',
  NO_OP: () => {},
  PARENT_OVERWRITE: Object.freeze({
    eval: 'function',
    matchHelper: 'function',
    priority: 'number',
  }),
  PRIORITY: 'PRIORITY',
  ROOT_CLASS: 'j-tree-editor',
  TYPES_CONFIG_OPTS: Object.freeze([
    // Allowed custom config properties
    // Auto expand the input to the size of it's text content
    'expandOnChange',
    // Array of allowed options to be used in select inputs, when editing
    'options'
  ]),
  TYPE_OVERWRITE: Object.freeze({
    build: 'function'
  })
})
