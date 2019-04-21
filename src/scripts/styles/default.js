import { DEF_SETTINGS, DEF_THEME } from '../constants'

const defaultTheme = { ...DEF_THEME }

const registerTheme = styleProps => {
  if (typeof styleProps !== 'object' || Array.isArray(styleProps))
    return console.warn(`Updating default styles requires a styles object argument`)

  if (styleProps.theme && styleProps.theme === 'light' || styleProps.theme === 'dark')
    defaultTheme.colors = { ...DEF_THEME.themes[styleProps.theme] }

  if (styleProps.colors)
    defaultTheme.colors = {
      ...defaultTheme.colors,
      ...styleProps.colors
    }
  if (styleProps.fonts)
    defaultTheme.fonts = {
      ...defaultTheme.fonts,
      ...styleProps.fonts
    }
  if (styleProps.speeds)
    defaultTheme.speeds = {
      ...defaultTheme.speeds,
      ...styleProps.speeds
    }

  return defaultTheme
}

const getStyles = () => {

  return {
  }

}

export {
  getStyles,
  registerTheme,
}
