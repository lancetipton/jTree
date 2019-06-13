"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorConfig = void 0;

var NO_OP = function NO_OP() {};

var EditorConfig = Object.freeze({
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