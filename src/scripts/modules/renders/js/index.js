import StringRender from './string'
import NumberRender from './number'
import MapRender from './map'
import CollectionRender from './collection'
import BooleanRender from './boolean'
import createStore from './store'

const JSRender = {
  init: createStore,
  base: StringRender,
  string: StringRender,
  number: NumberRender,
  map: MapRender,
  collection: CollectionRender,
  boolean: BooleanRender
}

export default JSRender