import { CollectionType, collSubTypes } from  './collection'
import { MapType, mapSubTypes } from  './map'
import { NumberType, numberSubTypes  } from  './number'
import { StringType, stringSubTypes } from  './string'

const types = {
  collection: CollectionType,
  map: MapType,
  number: NumberType,
  string: StringType,
}
const subTypes = {
  collection: collSubTypes,
  map: mapSubTypes,
  number: numberSubTypes,
  string: stringSubTypes,
}


export {
  types,
  subTypes
}