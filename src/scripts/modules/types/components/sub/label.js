import { elements } from 'element-r'

export const label = (name, value) => (
  value &&
    elements.label({ className: `item-${value.toLowerCase()}-label`, for: name }, value)
)