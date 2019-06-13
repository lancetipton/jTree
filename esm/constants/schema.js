"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = void 0;
var Schema = {
  MODES: Object.freeze({
    ADD: 'ADD',
    CUT: 'CUT',
    EDIT: 'EDIT',
    DRAG: 'DRAG',
    REMOVE: 'REMOVE',
    REPLACE: 'REPLACE',
    TEMP: 'TEMP'
  }),
  PROPS_CHECK: Object.freeze(['tree', 'Editor', 'parent', 'instance', 'settings']),
  ROOT: 'source',
  TREE_UPDATE_PROPS: Object.freeze(['key', 'value', 'mode', 'type', 'open', 'matchType', 'error']),
  EMPTY_TYPE: 'EmptyType',
  EMPTY: 'empty',
  TYPE_CLASS_CHECK: Object.freeze(['name', 'priority', 'defaultValue', 'eval'])
};
exports.Schema = Schema;