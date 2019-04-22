const themes = {
  light: {
    toolBorder: '#40413C',
    toolColor: '#40413C',
    toolHover: '#FC560B',
    background: '#FFFFFF',
    commit: '#4caf50',
    danger: '#fa0719',
    toolSelected: '#FC560B',
  },
  dark: {
    toolBorder: '#bfbec3',
    toolColor: '#bfbec3',
    toolHover: '#03a9f4',
    background: '#242a35',
    commit: '#4caf50',
    danger: '#fa0719',
    toolSelected: '#03a9f4'
  }
}

export const DEF_THEME = Object.freeze({
  themes: themes,
  colors: Object.freeze({ ...themes.dark }),
  fonts: Object.freeze({
    btn: `sans-serif`
  }),
  speeds: Object.freeze({
    showTools: '0.75s ease-in-out'
  }),
  shadow: '2px 4px 4px rgba(0,0,0,0.2)',
  maxToolsHeight: 29,
})
