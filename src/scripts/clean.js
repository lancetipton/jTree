import { clearObj } from './utils'
import { clearInstanceCache } from './types/builder'

export const cleanUp = (settings) => {
  clearInstanceCache()
  clearObj(settings)
}