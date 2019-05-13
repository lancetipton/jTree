import { clearObj, isObj } from './object_util'
import { clearInstanceCache, clearInstance } from './instance_util'
import { logData } from './methods_util'
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
    .map(key => (
      treeSchema[key] &&
      (clearSchema(treeSchema[key], treeSchema) || (treeSchema[key] = undefined))
    ))
)

export const clearSchema = (schema, treeSchema, removeInstance=true) => {

  if(!schema || !schema.pos || !treeSchema || !treeSchema[schema.pos]) return

  if(treeSchema && treeSchema[schema.pos] !== schema){
    return logData(
      `Can not clear schema from tree. tree.schema and schema do not match`, 'warn'
    )
  }
  
  const schemaPos = schema.pos
  removeInstance && clearInstance(schema.id)
  // Remove all references to clear out potential memory leaks
  // We don't un-mount the component on the instance, because
  // We're not removing the instance, just changing the object the references it
  _unset(schema, 'component')
  _unset(schema, 'parent')
  _unset(schema, 'instance')
  _unset(schema, 'value')
  // Remove the schema from the tree of schemas
  _unset(treeSchema, schema.pos)
  clearObj(schema)

  // Loop over the tree schema and clear out any child schemas to the current schema
  Object
    .entries(treeSchema)
    .map(([pos, schemaItem]) => {
      pos.indexOf(schemaPos) === 0 && clearSchema(schemaItem, treeSchema)
    })

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

