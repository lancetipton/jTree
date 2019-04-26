import { div, style  } from '../../elementr'
import { createIcon } from './create_icon'
import { uuid } from '../../../utils'

const btnStyles = () => {
  const stylId = uuid()
  
  const classes = {
    wrapper: `wrapper-${stylId}`,
    btns: `btns-${stylId}`,
  }
  
  const styles = style(`
    div.edit-btns-wrapper.${classes.wrapper} {
      position: relative;
    }
    div.edit-btns-wrapper.${classes.wrapper} > div.${classes.btns} {
      position: absolute;
      top: 0;
      right: 0;
    }
  `)

  return { classes, styles }
}

const btnTypes = {
  edit: 'pen',
  drag: 'hand-point-up',
  delete: 'trash-alt',
}

const buildIcon = (action, type, id) => {
  return action
    ? createIcon(
        btnTypes[type],
        `${type[0].toUpperCase()}${type.slice(1)}`,
        { icon: { id, onclick: action } }
      )
    : ''
}

const buildActions = (id, props) => (
  Object
    .keys(btnTypes)
    .reduce((actions, key) => {
      props[key] && actions.push(buildIcon( props[key], key, id ))
      return actions
    }, [])
)

export const createEditBtns = (props={}) => {
  
  if(!props.id) return []

  const { id } = props
  const { classes, styles } = btnStyles(id)

  return [
    styles,
    div({ className: `${classes.wrapper} edit-btns-wrapper` }, [
      div({ className: `${classes.btns} edit-btns` }, [
        ...buildActions(id, props)
      ])
    ])
  ]
}
