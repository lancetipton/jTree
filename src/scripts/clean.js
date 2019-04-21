import { clearObj } from './utils'

export const cleanUp = (settings, Editor) => {
  clearObj(settings)
  clearObj(Editor)
}