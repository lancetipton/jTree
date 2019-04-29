import { er, elements } from 'element-r'
const { div, span, a, style  } = elements


export const Icon = (name, text, extraProps={}, type) => {
  
  const props = {
    wrapper: {
      className: `icon-wrapper`,
      ...extraProps.wrapper
    },
    icon: {
      className: `icon icon-${type} fa fa-${name}`,
      href: 'javascript:void(0);',
      title: text || name,
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
