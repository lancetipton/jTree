import { clearObj, isObj } from './object_util'
import { clearInstanceCache, clearInstance } from './schema_util'
import _unset from 'lodash.unset'

const cleanSettingsObj = settings => {
  clearObj(settings.editor)
  clearObj(settings)
}

const clearTypeCache = (typeCache) => (
  isObj(typeCache) && Object
    .keys(typeCache)
    .map(key => {
      switch(key){
        case 'children':
          Object
          .values(typeCache.children)
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

const cleanTreeSchema = treeSchema => (
  Object
    .keys(treeSchema)
    .map(key => clearSchema(treeSchema[key]) || (treeSchema[key] = undefined))
)

export const clearSchema = (schema, treeSchema, removeInstance=true) => {
  if(!schema)
    return logData(
      `clearSchema method requries a schema to clear as the first argument`, 'warn'
    )

  const schemaPos = schema.pos
  if(schemaPos && treeSchema && treeSchema[schemaPos] !== schema){
    logData(`Can not clear schema from tree. tree.schema and schema do not match`, 'warn')
    treeSchema = undefined
  }

  removeInstance && clearInstance(schema.id)
  // Remove all references to clear out potential memory leaks
  // We don't unmount the component on the instance, because
  // We're not removing the instance, just changing the object the references it
  _unset(schema, 'component')
  _unset(schema, 'parent')
  _unset(schema, 'instance')
  _unset(schema, 'value')
  // Remove the schema from the tree of schemas
  schemaPos && treeSchema && _unset(treeSchema, schemaPos)
  clearObj(schema)
}

export const clearTypeData = (TypeCls, typeCache, includeClass=true) => {
  clearTypeCache(typeCache)
  _unset(TypeCls, 'BaseType')
  includeClass && clearObj(TypeCls)
}

export const cleanUp = (settings, tree) => {
  tree.schema && cleanTreeSchema(tree.schema)
  clearInstanceCache()
  cleanSettingsObj(settings)
}

