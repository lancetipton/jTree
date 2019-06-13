"use strict";

require("core-js/modules/es.array.index-of");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertElement = exports.removeElement = exports.getElement = exports.updateParentHeights = void 0;

var _jsutils = require("jsutils");

var _diff_util = require("./diff_util");

/**
 * Loop through the schema, from the bottom up
 * Updates the Heights of the parents to ensure all content can be seen
 * @param  { object } schema - schema at the location in the tree.schema to start the loop
 * @param  { number } updateHeight - hight that should be added to the schemas maxHeight
 * @return { void }
 */
const updateParentHeights = (schema, updateHeight, offset = 0) => {
  const domNode = schema && schema.domNode;
  if (!domNode || !updateHeight) return;
  const newHeight = domNode.scrollHeight + updateHeight;
  domNode.style.maxHeight = `${newHeight + offset}px`;
  schema.parent && updateParentHeights(schema.parent, newHeight);
};
/**
 * Gets domNode element base on the passed in selector
 * @param  { string || domNode }  selector - used to find the domNode on the document
 * @return { domNode } - found from the find selector call
 */


exports.updateParentHeights = updateParentHeights;

const getElement = selector => {
  if (selector instanceof HTMLElement) return selector;
  if (!selector || typeof selector !== 'string') return null;
  let selectorType = 'querySelector';

  if (selector.indexOf('#') === 0) {
    selectorType = 'getElementById';
    selector = selector.substr(1, selector.length);
  }

  return document[selectorType](selector);
};
/**
 * Removes a domNode from the document
 * @param  { string || domNode } selector - used to find the domNode on the document
 * @return { void }
 */


exports.getElement = getElement;

const removeElement = selector => {
  const element = getElement(selector);
  if (!element) return;
  element.remove ? element.remove() : element.parentNode ? element.parentNode.removeChild(element) : (0, _jsutils.logData)(`Could remove element from dom tree. No method exists`, element, 'warn');
};
/**
 * Creates or replaces a dom node on the parent node
 * Replace is referenced by ID
 * @param  { dome node } element - node to add or replace with
 * @param  { dome node } parent - parent node to add the element to
 * @return { dom node } replaced || added dom node
 */


exports.removeElement = removeElement;

const upsertElement = (element, parentSelector) => {
  if (Boolean(element instanceof HTMLElement) === false) return (0, _jsutils.logData)(`upsertElement method requires an HTML element as it's first argument`, element, parent, 'warn');
  const parent = getElement(parentSelector);
  if (!parent) return (0, _jsutils.logData)(`Could not add element to the dom tree. The parent element does not exists`, element, parent, 'warn'); // Get original element
  // This is why the passed in element must be a dom node
  // Otherwise the replaceEl and element would be the same

  const replaceEl = document.getElementById(element.id);
  if (replaceEl) return (0, _diff_util.diffUpdate)(element, replaceEl);
  return parent && parent.appendChild(element); // Replace original with new element
  // return replaceEl
  //   ? replaceEl.parentNode.replaceChild(element, replaceEl)
  //   : parent && parent.appendChild(element)
};

exports.upsertElement = upsertElement;