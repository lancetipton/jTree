export const Values = {
  KEY_MODS: Object.freeze([ 'shift', 'alt', 'ctrl', 'cmd' ]),
  NO_OP: () => {},
  PRIORITY: 'PRIORITY',
  MAP_TYPES: 'MAP_TYPES',
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
  ROOT: 'jTree-Root',
  DEFAULT_RENDERS: 'js',
  DEFAULT_TYPES: 'definitions'
}
