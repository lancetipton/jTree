import { elements } from 'element-r'
import { capitalize, isFunc, uuid } from 'jTUtils'

const { div, button, span, i, style } = elements

const icons = {
  open: 'fas fa-grip-lines-vertical',
  close: 'fas fa-times',
}

const open = content => {
  content
}

const buildBtn = ({ classes, attrs, content }, type) => {
  content = content || {}
  const html = content.html || [
    i({ className: icons[type] }),
    span({ className: `yd-modal-${type}-text` }, capitalize(type)),
  ]

  return button(
    { className: `yd-modal-${type} ${classes || ''}`, ...attrs },
    span(
      { className: `yd-modal-${type}-content ${content.classes || ''}`, ...content.attrs },
      html
    )
  )

}

const buildModal = ({ classes, attrs, content }, close) => {
    if(!content.html) return
  const modalContent = div({ class: 'yd-modal-content', id: content.id })
  modalContent.appendChild(content.html)
  
  const closeAction = close && buildBtn(close, 'close')
  
  const modalNode = div(
    { className: `yd-modal ${classes || ''}`, ...attrs, id: modal.id },
    closeAction,
    modalContent,
  )
  
  const modalWrapper = div({ className: 'yd-modal-wrapper' },
    div({ className: 'yd-modal-overlay' }),
    modalNode,
  )

  attachAction(closeAction, 'remove', modal.id, content.id)
  return modalWrapper
}

const updateModal = (type, modalId, contentId, html) => {
  if(!type || !modalId) return

  let modalNode = document.getElementById(modalId)
  if(modalNode && html && contentId){
    let contentNode = document.getElementById(contentId)
    contentNode && contentNode.replaceChild(html, contentNode.firstChild)
    contentNode = undefined
  }
  
  modalNode && modalNode.classList[type]('yd-modal-show')
  modalNode = undefined
}

const attachAction = (actionNode, type, modalId, contentId) => {
  if(!type || !modalId) return
  actionNode.onclick = updateModal.bind(actionNode, type, modalId, contentId)
}

/**
 * Builds a modal dom node, and adds actions to open and close it
 * @param  { object } props.open - describes the open modal domNode
 * @param  { object } props.close - describes the close modal domNode
 * @param  { object } props.modal - describes the modal domNode
 * Each of the above should have these props
 * @param  { string }           .classes - classes to add to this domNode
 * @param  { string }           .id -  id to add to this domNode
 * @param  { object }           .attrs -  attrs to add to this domNode
 * @param  { object }           .content -  children of the domNode
 * 
 * @return { domNode || method } - domNode button or method to open modal
 */
export const Modal = ({ open, close, modal }) => {
  if(!modal) return

  // Build modal ID
  modal.id = modal.id || uuid()
  modal.content.id = modal.content.id || uuid()

  // Build modal, and close action
  const modalWrapper = modal && buildModal(modal, close)

  // Build open action if it exists
  const openAction = open && buildBtn(open, 'open')
  // Attach openAction node to open modal
  openAction && attachAction(openAction, 'add', modal.id, modal.content.id)

  // Add modal to the dom
  document.body.appendChild(modalWrapper)

  // Return the openAction html, or openModal action
  return openAction || updateModal.bind(modalWrapper, 'add', modal.id, modal.content.id)
}

