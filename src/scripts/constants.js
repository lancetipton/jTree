export const KEY_MODS = [ 'shift', 'alt', 'ctrl', 'cmd' ]
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


export const DEF_SETTINGS =  Object.freeze({
  destroyOnSave: true,
  destroyOnCancel: true,
  changeDebounce: 50,
  iconType: 'far',
  styles: Object.freeze({}),
  popper: {
    eventsEnabled: false,
    removeOnDestroy: true,
    placement: 'bottom-start',
    modifiers: {},
  }
})

export const LOG_TYPES = Object.freeze([
  'error',
  'dir',
  'log',
  'warn'
])

export const MAP_TYPES = 'MAP_TYPES'