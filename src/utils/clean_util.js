import { clearObj, isObj, mapObj, logData } from 'jsUtils'
import { clearInstanceCache, clearInstance } from './instance_util'
import _unset from 'lodash.unset'

const cleanSettingsObj = settings => {
  clearObj(settings.Editor.config)
  clearObj(settings)
}

const clearTypeCache = (typeCache) => (
  isObj(typeCache) && Object
    .keys(typeCache)
    .map(key => {
      switch(key){
        case 'children':
          Object
          .values(typeCache)
          .map(child => clearTypeCache(child))
          break
        case 'extends':
          Object
          .keys(typeCache.extends)
          .map(key => _unset(typeCache.extends, key))
          break
      }
      _unset(typeCache, key)
    }).length || (typeCache = undefined)
)

const cleanTreeSchema = tree => (
  Object
    .keys(tree.schema)
    .map(key => (
      tree.schema[key] &&
      (clearSchema(tree.schema[key], tree) || (tree.schema[key] = undefined))
    ))
)

export const clearSchema = (schema, tree, removeInstance=true) => {
  if(!schema || !schema.pos || !tree.schema || !tree.schema[schema.pos]) return

  if(tree.schema && tree.schema[schema.pos] !== schema){
    return logData(
      `Can not clear schema from tree. tree.schema and schema do not match`, 'warn'
    )
  }
  
  const schemaPos = schema.pos
  // Remove built instance
  // Sometimes the instance is re-used, so check before removing. I.E. replace
  removeInstance && clearInstance(schema.id)
  // Remove ref in the tree idMap
  _unset(tree.idMap, schema.id)
  
  // Remove all references to clear out potential memory leaks
  _unset(schema, 'domNode')
  _unset(schema, 'parent')
  _unset(schema, 'instance')
  _unset(schema, 'value')

  // Remove the schema from the tree of schemas
  _unset(tree.schema, schema.pos)
  clearObj(schema)

  // Loop over the tree schema and clear out any child schemas to the current schema
  // tree.idMap will also be cleared out for each cleared schema
  mapObj(tree.schema, (pos, schemaItem) => {
    pos.indexOf(schemaPos) === 0 && clearSchema(schemaItem, tree)
  })

}

export const clearTypeData = (TypeCls, typeCache, includeClass=true) => {
  clearTypeCache(typeCache)
  _unset(TypeCls, 'BaseType')
  includeClass && clearObj(TypeCls)
}

export const cleanUp = (settings, tree) => {
  tree.schema && cleanTreeSchema(tree)
  clearInstanceCache()
  cleanSettingsObj(settings)
}

