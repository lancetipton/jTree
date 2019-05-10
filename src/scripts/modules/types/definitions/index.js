import BaseType from  './base'
import { BooleanType } from  './boolean'
import { EmptyType } from  './empty'
import { CollectionType, collSubTypes } from  './collection'
import { MapType, mapSubTypes } from  './map'
import { NumberType, numberSubTypes  } from  './number'
import { StringType, stringSubTypes } from  './string'

const types = {
  boolean: BooleanType,
  collection: CollectionType,
  empty: EmptyType,
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


export default {
  BaseType,
  types,
  subTypes
}