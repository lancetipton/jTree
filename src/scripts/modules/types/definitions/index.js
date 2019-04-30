import { CollectionType, collSubTypes } from  './collection'
import { MapType, mapSubTypes } from  './map'
import { NumberType, numberSubTypes  } from  './number'
import { StringType, stringSubTypes } from  './string'
import { BooleanType } from  './boolean'
import BaseType from  './base'

const types = {
  collection: CollectionType,
  map: MapType,
  number: NumberType,
  string: StringType,
  boolean: BooleanType,
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