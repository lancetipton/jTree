import { clearObj, clearInstanceCache } from './utils'

export const cleanUp = (settings) => {
  clearInstanceCache()
  clearObj(settings)
}