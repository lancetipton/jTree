import { DEF_SETTINGS } from '../constants'
import { deepMerge } from './object_util'
/**
 * Merges the def settings with the passed in settings
 * @param  {any} settings 
 * @return {void}
 */
export const buildSettings = settings => deepMerge(DEF_SETTINGS, settings)
