export * from './diff'
export * from './editor'
export * from './settings'
import { deepFreeze } from 'jsUtils'
import { Schema } from './schema'
import { Values } from './values'


let useValues = deepFreeze({ ...Values })
const updateDefValues = update => (useValues = deepFreeze({ ...useValues, ...update }))
let useSchema = deepFreeze({ ...Schema })
const updateDefSchema = update => (useSchema = deepFreeze({ ...useSchema, ...update }))

const Constants = {
  updateDefSchema,
  updateDefValues,
}

Object.defineProperty(Constants, 'Values', {
  get: () => {
    return useValues
  },
  enumerable: true,
})

Object.defineProperty(Constants, 'Schema', {
  get: () => {
    return useSchema
  },
  enumerable: true,
})

export default Constants