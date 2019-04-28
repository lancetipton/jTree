import { er, elements } from 'element-r'
const { div, span } = elements

export const typeLabel = type => (
  div({ className: `type-label` }, 
    span({ className: `type-text ${type}-text` }, `${type[0].toUpperCase()}${type.slice(1)}`,)
  )
)