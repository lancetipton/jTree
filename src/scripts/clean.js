import { clearObj, clearInstanceCache } from './utils'

const cleanSettingsObj = settings => {
  clearObj(settings.editor)
  settings.editor = undefined
  delete settings.editor
  clearObj(settings)
}

export const cleanUp = (settings) => {
  clearInstanceCache()
  cleanSettingsObj(settings)
}