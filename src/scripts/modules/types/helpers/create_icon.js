import { div, span, a, style  } from '../../elementr'
import { uuid } from '../../../utils'

const iconStyles = () => {
  const stylId = uuid()
  
  const classes = {
    wrapper: `wrapper-${stylId}`,
    icon: `icon-${stylId}`,
    text: `text-${stylId}`
  }
  
  const styles = style(`
    .icon-wrapper.${classes.wrapper} {
      
    }
    .icon-wrapper.${classes.wrapper} > a.${classes.icon} {
      
    }
    .icon-wrapper.${classes.wrapper} > a.${classes.icon} > .icon-text.${classes.text} {
      
    }
  `)

  return { classes, styles }
}


export const createIcon = (name, text, extraProps={}) => {
  const { classes, styles } = iconStyles()
  
  const props = {
    wrapper: {
      className: `icon-wrapper ${classes.wrapper}`,
      ...extraProps.wrapper
    },
    icon: {
      className: `icon-${name} fa fa-${name} ${classes.icon}`,
      href: 'javascript:void(0);',
      title: text || name,
      ...extraProps.icon
    },
    text: {
      className: `icon-text ${classes.text}`,
      ...extraProps.text
    }
  }

  const children = text
    ? [ styles, a(props.icon, span(props.text, text)) ]
    : [ styles, a(props.icon) ]
  return span(props.wrapper, children )
}