import { DIFF } from '../constants'
const { NODE_TYPES, EVENT_ATTRS, SAME_NODE } = DIFF

const updateOption = (newNode, oldNode) => (
  updateAttribute(newNode, oldNode, 'selected')
)

const updateInput = (newNode, oldNode) => {
  const newValue = newNode.value
  const oldValue = oldNode.value
  updateAttribute(newNode, oldNode, 'checked')
  updateAttribute(newNode, oldNode, 'disabled')
  
  
  if (newValue !== oldValue) {
    oldNode.setAttribute('value', newValue)
    oldNode.value = newValue
  }

  if (newValue === 'null') {
    oldNode.value = ''
    oldNode.removeAttribute('value')
  }
  
  !newNode.hasAttributeNS(null, 'value')
    ? oldNode.removeAttribute('value')
    : oldNode.type === 'range'
      ? oldNode.value = newValue
      : null
}


const updateTextarea = (newNode, oldNode) => {
  const newValue = newNode.value
  if (newValue !== oldNode.value) oldNode.value = newValue
  
  if(!oldNode.firstChild || oldNode.firstChild.nodeValue === newValue)
    return
  
  if(newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder)
    return

  oldNode.firstChild.nodeValue = newValue
}

const NODE_NAME_CHECK = {
  INPUT: updateInput,
  OPTION: updateOption,
  TEXTAREA: updateTextarea,
}

const updateParent = (newNode, oldNode) => {
  newNode.nodeType === NODE_TYPES.ELEMENT_NODE && copyAttrs(newNode, oldNode)

  Object.values(NODE_TYPES).indexOf(newNode.nodeType) !== -1 && 
  oldNode.nodeValue !== newNode.nodeValue &&
    (oldNode.nodeValue = newNode.nodeValue)
  
  NODE_NAME_CHECK[newNode.nodeName] &&
    NODE_NAME_CHECK[newNode.nodeName](newNode, oldNode)

  copyEvents(newNode, oldNode)

  return oldNode
}

const removeOldAttrs = (newNode, oldNode, oldAttrs) => (
  Object
    .values(oldAttrs)
    .map(attr => {
      if (attr.specified === false) return

      if (!attr.namespaceURI)
        return !newNode.hasAttributeNS(null, attr.name) &&
          oldNode.removeAttribute(attr.name)
      
      attr.name = attr.localName || attr.name
      !newNode.hasAttributeNS(attr.namespaceURI, attr.name) &&
        oldNode.removeAttributeNS(attr.namespaceURI, attr.name)
    })
)

const addNewAttrs = (newNode, oldNode, newAttrs) => (
  Object
    .values(newAttrs)
    .map(attr => {
      
      if (attr.namespaceURI) {
        attr.name = attr.localName
        const fromValue = oldNode.getAttributeNS(attr.namespaceURI, attrLocalName || attr.name)
        return fromValue !== attr.value &&
          oldNode.setAttributeNS(attr.namespaceURI, attr.name, attr.value)
      } 
      
      if (!oldNode.hasAttribute(attr.name))
        return oldNode.setAttribute(attr.name, attr.value)

      if (oldNode.getAttribute(attr.name) === attr.value) return
      
      attr.value === 'null' || attr.value === 'undefined'
        ? oldNode.removeAttribute(attr.name)
        : oldNode.setAttribute(attr.name, attr.value)

    })
)

const copyAttrs = (newNode, oldNode) => {
  const oldAttrs = oldNode.attributes
  const newAttrs = newNode.attributes

  addNewAttrs(newNode, oldNode, newAttrs)
  removeOldAttrs(newNode, oldNode, oldAttrs)
}

const copyEvents = (newNode, oldNode) => (
  EVENT_ATTRS.map(ev => (
    newNode[ev] && (oldNode[ev] = newNode[ev]) ||
    oldNode[ev] && (oldNode[ev] = undefined)
  ))
)

const updateAttribute = (newNode, oldNode, name) => {
  if(newNode[name] === oldNode[name])
    return

  oldNode[name] = newNode[name]
  newNode[name]
    ? oldNode.setAttribute(name, '')
    : oldNode.removeAttribute(name)
}

const same = (a, b) => (
  SAME_NODE.reduce((isSame, key) => (
    isSame
      ? isSame
      : typeof a[key] === 'function'
        ? a.isSameNode(b)
        : a.type === NODE_TYPES.TEXT_NODE
          ? a.nodeValue === b.nodeValue
          : a[key] === b[key]
  ), false)
)

const updateChildren = (newNode, oldNode) => {

  let oldChild
  let newChild
  let morphed
  let offset = 0
  
  for (let i = 0; ; i++) {
    oldChild = oldNode.childNodes[i]
    newChild = newNode.childNodes[i - offset]

    if (!oldChild && !newChild) break
    
    if (!newChild && oldNode.removeChild(oldChild) && (i-- > -1))
      continue
    
    if (!oldChild && oldNode.appendChild(newChild) && (offset++ > -1))
      continue
    
    if (same(newChild, oldChild)) {
      morphed = runNodeDiff(newChild, oldChild)
      morphed !== oldChild && oldNode.replaceChild(morphed, oldChild) && offset++
      continue
    }
    
    let oldMatch = null

    for (let j = i; j < oldNode.childNodes.length; j++) {
      if (!same(oldNode.childNodes[j], newChild)) continue
      oldMatch = oldNode.childNodes[j]
      break
    }

    if (oldMatch) {
      morphed = runNodeDiff(newChild, oldMatch)
      if (morphed !== oldMatch) offset++
      oldNode.insertBefore(morphed, oldChild)
      continue
    }

    if (!newChild.id && !oldChild.id) {
      morphed = runNodeDiff(newChild, oldChild)
      morphed !== oldChild && oldNode.replaceChild(morphed, oldChild) && offset++
      continue
    }

    oldNode.insertBefore(newChild, oldChild) && offset++
  }

}

const runNodeDiff = (newNode, oldNode) => {
  if (!oldNode) return newNode
  else if (!newNode) return null
  else if (newNode.isSameNode && newNode.isSameNode(oldNode)) return oldNode
  else if (newNode.tagName !== oldNode.tagName) return newNode 

  updateParent(newNode, oldNode)
  updateChildren(newNode, oldNode)

  return oldNode
}

export const diffUpdate = (newNode, oldNode, options={}) => {
  return options.childrenOnly
    ? (updateChildren(newNode, oldNode) || oldNode)
    : runNodeDiff(newNode, oldNode)
}