import { logData } from './methods_util'

export const getElement = selector => {
  if(selector instanceof HTMLElement) return selector
  if(!selector || typeof selector !== 'string') return null
  
  let selectorType = 'querySelector'

  if (selector.indexOf('#') === 0) {
    selectorType = 'getElementById'
    selector = selector.substr(1, selector.length)
  }

  return document[selectorType](selector)
}

export const removeElement = selector => {
  const element = getElement(selector)
  if(!element) return

  element.remove
    ? element.remove()
    : element.parentNode
      ? element.parentNode.removeChild(element)
      : logData(
        `Could remove element from dom tree. No method exists`,
        element,
        'warn'
      )
}

/**
 * Creates or replaces a dom node on the parent node
 * Replace is referenced by ID
 * @param  { dome node } element - node to add or replace with
 * @param  { dome node } parent - parent node to add the element to
 * @return { dom node } replaced || added dom node
 */
export const upsertElement = (element, parentSelector) => {
  if(Boolean(element instanceof HTMLElement) === false)
    return logData(
      `upsertElement method requires an HTML element as it's first argument`,
      element,
      parent,
      'warn'
    )

  const parent = getElement(parentSelector)
  if(!parent)
    return logData(
      `Could not add element to the dom tree. The parent element does not exists`,
      element,
      parent,
      'warn'
    )
  
  // Get original element
  // This is why the passed in element must be a dom node
  // Otherwise the replaceEl and element would be the same
  const replaceEl = document.getElementById(element.id)
  // Replace original with new element
  return replaceEl
    ? replaceEl.parentNode.replaceChild(element, replaceEl)
    : parent && parent.appendChild(element)
}
