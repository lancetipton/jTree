export const appendChild = (parent, child) => parent && child && parent.appendChild(child)

export const prependChild = (parent, child) => parent && child && parent.prepend(child)

export const createElement = tag => tag && document.createElement(tag)

export const removeEventListener = (parent, type, listener) =>
  parent && parent.removeEventListener(type, listener)

export const addEventListener = (parent, type, listener) =>
  parent && parent.addEventListener(type, listener)

export const getMutationObserver = (elementSelector, callback, settings={}) => {
  const observer = new MutationObserver(callback)
  const obsParams = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    ...(settings.observer || {})
  }
  observer.observe(elementSelector, obsParams)

  return observer
}

export const getDomNode = selector => {
  if(selector instanceof HTMLElement) return selector
  if(!selector || typeof selector !== 'string') return null

  const response = document.querySelectorAll(selector);
  return response instanceof HTMLCollection && response[0]
    ? response[0]
    : response
}

