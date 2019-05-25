import { elements, eR } from 'element-r'
const { div, span } = elements

export const errorMessage = error => (
  error && div({ className: 'item-error-message' },
    span({ className: 'item-error-text' }, error)
  ) || null
)