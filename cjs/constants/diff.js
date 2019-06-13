"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DIFF = void 0;
const DIFF = {
  EVENT_ATTRS: Object.freeze(['onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart', 'ondragstart', 'ondrag', 'ondragenter', 'ondragleave', 'ondragover', 'ondrop', 'ondragend', 'onkeydown', 'onkeypress', 'onkeyup', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onselect', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur', 'oninput', 'oncontextmenu', 'onfocusin', 'onfocusout']),
  NODE_TYPES: Object.freeze({
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8
  }),
  SAME_NODE: Object.freeze(['tagName', 'isSameNode', 'id', 'type'])
};
exports.DIFF = DIFF;