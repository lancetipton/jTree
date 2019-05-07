export const Schema = {
  MODES: Object.freeze({
    EDIT: 'EDIT',
    DRAG: 'DRAG',
    REMOVE: 'REMOVE'
  }),
  NOT_IN_TREE: 'NOT_IN_TREE',
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
  ])
}
