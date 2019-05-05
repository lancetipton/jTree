export const Values = {
  KEY_MODS: Object.freeze([ 'shift', 'alt', 'ctrl', 'cmd' ]),
  NO_OP: () => {},
  PRIORITY: 'PRIORITY',
  MAP_TYPES: 'MAP_TYPES',
  NOT_IN_TREE: 'NOT_IN_TREE',
  PARENT_OVERWRITE: Object.freeze({
    eval: 'function',
    matchHelper: 'function',
    priority: 'number',
  }),
  TYPE_OVERWRITE: Object.freeze({
    build: 'function'
  }),
  LOG_TYPES: Object.freeze([
    'error',
    'dir',
    'log',
    'warn'
  ]),
  ROOT_CLASS: 'j-tree-editor',
  ROOT: 'content',
  DEFAULT_RENDERS: 'js',
  DEFAULT_TYPES: 'definitions',
  MODES: Object.freeze({
    EDIT: 'EDIT',
    DRAG: 'DRAG',
    REMOVE: 'REMOVE'
  }),
  PROPS_CHECK: Object.freeze([
    'tree',
    'Editor',
    'parent',
    'instance',
    'settings'
  ]),
  TREE_UPDATE_PROPS: Object.freeze([
    'key',
    'value',
    'mode',
    'type',
    'matchType'
  ]),
  CLEAVE_CLS: 'item-cleave',
  EDIT_CLS: 'item-edit',
  DATA_TREE_ID: 'data-tree-id',
  DATA_SCHEMA_KEY: 'data-schema-key',
  TYPES_CONFIG_OPTS: Object.freeze([
    // Allowed custom config properties
    // Auto expand the input to the size of it's text content
    'expandOnChange',
    // Array of allowed options to be used in select inputs, when editing
    'options'
  ])
}
