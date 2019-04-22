import { CollectionType, collSubTypes } from  './collection'
import { MapType, mapSubTypes } from  './map'
import { NumberType, numberSubTypes  } from  './number'
import { StringType, stringSubTypes } from  './string'
import BaseType from  './base'

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
  BaseType,
  types,
  subTypes
}