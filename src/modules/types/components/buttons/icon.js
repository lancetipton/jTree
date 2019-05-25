import { er, elements } from 'element-r'
const { div, span, a, style  } = elements


export const Icon = (icon, text, extraProps={}) => {
  const lowerText = text && text.toLowerCase()
  const wrapClasses = extraProps.wrapper && extraProps.wrapper.className
    ? `icon-wrapper wrap-icon-${lowerText} ${extraProps.wrapper.className}`
    : `icon-wrapper wrap-icon-${lowerText}`
  
  const props = {
    wrapper: {
      ...extraProps.wrapper,
      className: wrapClasses,
    },
    icon: {
      className: `icon icon-${lowerText} fa fa-${icon}`,
      href: 'javascript:void(0);',
      title: text || icon,
      ...extraProps.icon
    },
    text: {
      className: `icon-text`,
      ...extraProps.text
    }
  }

  const children = text
    ? [ a(props.icon, span(props.text, text)) ]
    : [ a(props.icon) ]
  return span(props.wrapper, children )
}
