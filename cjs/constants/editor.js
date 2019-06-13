"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorConfig = void 0;

const NO_OP = () => {};

const EditorConfig = Object.freeze({
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
});
exports.EditorConfig = EditorConfig;