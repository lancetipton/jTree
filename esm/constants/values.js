"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Values = void 0;

var NO_OP = function NO_OP() {};

var Values = Object.freeze({
  CLEAVE_CLS: 'item-cleave',
  CUSTOM_EVENTS: Object.freeze({
    onBlur: NO_OP,
    onCancel: NO_OP,
    onChange: NO_OP,
    onClick: NO_OP,
    onCopy: NO_OP,
    onCut: NO_OP,
    onDelete: NO_OP,
    onEdit: NO_OP,
    onFocus: NO_OP,
    onKeyDown: NO_OP,
    onKeyUp: NO_OP,
    onPaste: NO_OP,
    onSave: NO_OP
  }),
  DOM_EVENTS: Object.freeze(['onChange', 'onClick', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp']),
  DATA_SCHEMA_KEY: 'data-schema-key',
  DATA_TREE_ID: 'data-tree-id',
  DEFAULT_TYPES: 'definitions',
  EDIT_CLS: 'item-edit',
  JT_ROOT_HEADER_ID: 'jt-root-header',
  LOG_TYPES: Object.freeze(['error', 'dir', 'log', 'warn']),
  MAP_TYPES: 'MAP_TYPES',
  NO_OP: NO_OP,
  NUMBER_CLS: 'item-number',
  PASTE_ACTION_CLS: 'item-paste-action',
  PARENT_OVERWRITE: Object.freeze({
    eval: 'function',
    matchHelper: 'function',
    priority: 'number'
  }),
  PRIORITY: 'PRIORITY',
  ROOT_CLASS: 'j-tree-editor',
  SHOW_PASTE_CLS: 'show-paste-action',
  TYPE_OVERWRITE: Object.freeze({
    componentDidMount: 'function',
    componentDidUpdate: 'function',
    onBlur: 'function',
    onCancel: 'function',
    onChange: 'function',
    onClick: 'function',
    onCopy: 'function',
    onCut: 'function',
    onDelete: 'function',
    onEdit: 'function',
    onFocus: 'function',
    onKeyDown: 'function',
    onKeyUp: 'function',
    onPaste: 'function',
    onSave: 'function',
    onToggle: 'function',
    render: 'function'
  }),
  TYPES_CONFIG_OPTS: Object.freeze([// Allowed custom config properties
  // Auto expand the input to the size of it's text content
  'expandOnChange', // Array of allowed options to be used in select inputs, when editing
  'options', // Attributes to add the key input / select when editing
  'keyAttrs', // Attributes to add the value input / select when editing
  'valueAttrs'])
});
exports.Values = Values;