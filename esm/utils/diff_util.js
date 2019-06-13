"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffUpdate = void 0;

var _constants = require("../constants");

var NODE_TYPES = _constants.DIFF.NODE_TYPES,
    EVENT_ATTRS = _constants.DIFF.EVENT_ATTRS,
    SAME_NODE = _constants.DIFF.SAME_NODE;

var updateOption = function updateOption(newNode, oldNode) {
  return updateAttribute(newNode, oldNode, 'selected');
};

var updateInput = function updateInput(newNode, oldNode) {
  var newValue = newNode.value;
  var oldValue = oldNode.value;
  updateAttribute(newNode, oldNode, 'checked');
  updateAttribute(newNode, oldNode, 'disabled');

  if (newValue !== oldValue) {
    oldNode.setAttribute('value', newValue);
    oldNode.value = newValue;
  }

  if (newValue === 'null') {
    oldNode.value = '';
    oldNode.removeAttribute('value');
  }

  !newNode.hasAttributeNS(null, 'value') ? oldNode.removeAttribute('value') : oldNode.type === 'range' ? oldNode.value = newValue : null;
};

var updateTextarea = function updateTextarea(newNode, oldNode) {
  var newValue = newNode.value;
  if (newValue !== oldNode.value) oldNode.value = newValue;
  if (!oldNode.firstChild || oldNode.firstChild.nodeValue === newValue) return;
  if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) return;
  oldNode.firstChild.nodeValue = newValue;
};

var NODE_NAME_CHECK = {
  INPUT: updateInput,
  OPTION: updateOption,
  TEXTAREA: updateTextarea
};

var updateParent = function updateParent(newNode, oldNode) {
  newNode.nodeType === NODE_TYPES.ELEMENT_NODE && copyAttrs(newNode, oldNode);
  Object.values(NODE_TYPES).indexOf(newNode.nodeType) !== -1 && oldNode.nodeValue !== newNode.nodeValue && (oldNode.nodeValue = newNode.nodeValue);
  NODE_NAME_CHECK[newNode.nodeName] && NODE_NAME_CHECK[newNode.nodeName](newNode, oldNode);
  copyEvents(newNode, oldNode);
  return oldNode;
};

var removeOldAttrs = function removeOldAttrs(newNode, oldNode, oldAttrs) {
  return Object.values(oldAttrs).map(function (attr) {
    if (attr.specified === false) return;
    if (!attr.namespaceURI) return !newNode.hasAttributeNS(null, attr.name) && oldNode.removeAttribute(attr.name);
    attr.name = attr.localName || attr.name;
    !newNode.hasAttributeNS(attr.namespaceURI, attr.name) && oldNode.removeAttributeNS(attr.namespaceURI, attr.name);
  });
};

var addNewAttrs = function addNewAttrs(newNode, oldNode, newAttrs) {
  return Object.values(newAttrs).map(function (attr) {
    if (attr.namespaceURI) {
      attr.name = attr.localName;
      var fromValue = oldNode.getAttributeNS(attr.namespaceURI, attrLocalName || attr.name);
      return fromValue !== attr.value && oldNode.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    }

    if (!oldNode.hasAttribute(attr.name)) return oldNode.setAttribute(attr.name, attr.value);
    if (oldNode.getAttribute(attr.name) === attr.value) return;
    attr.value === 'null' || attr.value === 'undefined' ? oldNode.removeAttribute(attr.name) : oldNode.setAttribute(attr.name, attr.value);
  });
};

var copyAttrs = function copyAttrs(newNode, oldNode) {
  var oldAttrs = oldNode.attributes;
  var newAttrs = newNode.attributes;
  addNewAttrs(newNode, oldNode, newAttrs);
  removeOldAttrs(newNode, oldNode, oldAttrs);
};

var copyEvents = function copyEvents(newNode, oldNode) {
  return EVENT_ATTRS.map(function (ev) {
    return newNode[ev] && (oldNode[ev] = newNode[ev]) || oldNode[ev] && (oldNode[ev] = undefined);
  });
};

var updateAttribute = function updateAttribute(newNode, oldNode, name) {
  if (newNode[name] === oldNode[name]) return;
  oldNode[name] = newNode[name];
  newNode[name] ? oldNode.setAttribute(name, '') : oldNode.removeAttribute(name);
};

var same = function same(a, b) {
  return SAME_NODE.reduce(function (isSame, key) {
    return isSame ? isSame : typeof a[key] === 'function' ? a.isSameNode(b) : a.type === NODE_TYPES.TEXT_NODE ? a.nodeValue === b.nodeValue : a[key] === b[key];
  }, false);
};

var updateChildren = function updateChildren(newNode, oldNode) {
  var oldChild;
  var newChild;
  var morphed;
  var offset = 0;

  for (var i = 0;; i++) {
    oldChild = oldNode.childNodes[i];
    newChild = newNode.childNodes[i - offset];
    if (!oldChild && !newChild) break;
    if (!newChild && oldNode.removeChild(oldChild) && i-- > -1) continue;
    if (!oldChild && oldNode.appendChild(newChild) && offset++ > -1) continue;

    if (same(newChild, oldChild)) {
      morphed = runNodeDiff(newChild, oldChild);
      morphed !== oldChild && oldNode.replaceChild(morphed, oldChild) && offset++;
      continue;
    }

    var oldMatch = null;

    for (var j = i; j < oldNode.childNodes.length; j++) {
      if (!same(oldNode.childNodes[j], newChild)) continue;
      oldMatch = oldNode.childNodes[j];
      break;
    }

    if (oldMatch) {
      morphed = runNodeDiff(newChild, oldMatch);
      if (morphed !== oldMatch) offset++;
      oldNode.insertBefore(morphed, oldChild);
      continue;
    }

    if (!newChild.id && !oldChild.id) {
      morphed = runNodeDiff(newChild, oldChild);
      morphed !== oldChild && oldNode.replaceChild(morphed, oldChild) && offset++;
      continue;
    }

    oldNode.insertBefore(newChild, oldChild) && offset++;
  }
};

var runNodeDiff = function runNodeDiff(newNode, oldNode) {
  if (!oldNode) return newNode;else if (!newNode) return null;else if (newNode.isSameNode && newNode.isSameNode(oldNode)) return oldNode;else if (newNode.tagName !== oldNode.tagName) return newNode;
  updateParent(newNode, oldNode);
  updateChildren(newNode, oldNode);
  return oldNode;
};

var diffUpdate = function diffUpdate(newNode, oldNode) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return options.childrenOnly ? updateChildren(newNode, oldNode) || oldNode : runNodeDiff(newNode, oldNode);
};

exports.diffUpdate = diffUpdate;