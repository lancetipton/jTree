export const Schema = {
  MODES: Object.freeze({
    ADD: 'ADD',
    EDIT: 'EDIT',
    DRAG: 'DRAG',
    REMOVE: 'REMOVE',
  }),
  PROPS_CHECK: Object.freeze([
    'tree',
    'Editor',
    'parent',
    'instance',
    'settings'
  ]),
  ROOT: 'source',
  TREE_UPDATE_PROPS: Object.freeze([
    'key',
    'value',
    'mode',
    'type',
    'open',
    'matchType'
  ]),
  EMPTY_TYPE: 'EmptyType',
  EMPTY: 'empty',
}
