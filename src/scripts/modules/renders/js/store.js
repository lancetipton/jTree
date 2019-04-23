import dispatcher from './dispatcher'
import actions from './actions'
const { dispatch, watch, forget, create } = dispatcher

// this is used to define if an item should be re-rendered
// it should contain anything that can be changed by a user
const serialItem = item => [
  !!item.visible,
  !!item.expanded,
  !!item.selected,
  !!item.edit,
].join(``)

const initialState = {
  data: [],
  selected: null,
  childrenCache: {},
  itemCache: {},
  isModalVisible: false,
}

const getItem = (idOrItem, state) => (
  typeof idOrItem === `string`
    ? state.itemCache[idOrItem]
    : idOrItem
)
const getParent = (item, state) => {
  if (item.parentItem) return item.parentItem
  if (!item.parentId) return null

  item.parentItem = getItem(item.parentId, state)
  return item.parentItem
}
const getChildrenOf = (id, state) => {
  if (id in state.childrenCache)
    return state.childrenCache[id]

  children = state.data.filter(item => item.parentId === id)

  return children && children.length
    ? children
    : false
}

const updateItemCache = (itemCache, item) => ({
  ...itemCache,
  [item.id]: {
    ...itemCache[item.id],
    ...item
  }
})

const onDispatch = (state, ...action) => {
  const { type, ...payload } = action
  if(!type || !Object.keys(payload).length)
    return state
  
  switch(type){

    case actions.ADD_DATA: {
      // newData === Array
      return !payload.newData
        ? state
        : {
            ...state,
            data: updated.data.concat(payload.newData),
            itemCache: payload.newData.reduce((itemCache, item) => (
              (itemCache[item.id] = item) && itemCache),
              updated.itemCache
            )
          }
    }
    
    case actions.UPDATE_ITEM: {
      if(!payload || !payload.id)
        return state

      const item = getItem(payload.id, state)
      // If no update, or the item has not been update, just return
      return !item || serialItem(item) === serialItem(payload)
        ? state
        : {
          ...state,
          itemCache: updateItemCache(state.itemCache, payload)
        }
    }

    case actions.UPDATE_SELECTED: {
      const updated = { ...state, selected: null }
      // Remove current selected
      if(state.selected){
        const curId = state.selected.id
        updated.itemCache = updateItemCache(updated.itemCache, {
          ...updated.itemCache[curId],
          selected: false,
        })
      }
      // Get the item to update
      const item = getItem(payload.id, state)
      // if no item to update reutrn
      if(!item) return updated
      // Update the passed in item to selected
      updated.itemCache = updateItemCache(updated.itemCache, {
        ...item,
        selected: true,
      })
      updated.selected = item

      // return updated state
      return updated
    }
    
    case actions.UPDATE_EXPANDED: {
      const children = getChildrenOf(payload.id, state)
      const item = getItem(payload.id, state)
      
      return !item
        ? state
        : {
          ...state,
          itemCache: updateItemCache(updated.itemCache, {
            ...item,
            expanded: payload.expanded,
          }),
          childrenCache: {
            ...state.childrenCache,
            [item.id]: children && children.map(child => (
              (child.visible = payload.expanded) && child
            )) || undefined
          }
        }
    }

    case actions.UPDATE_EDIT: {
      const children = getChildrenOf(payload.id, state)
      const item = getItem(payload.id, state)
      
      return !item
        ? state
        : {
          ...state,
          itemCache: updateItemCache(updated.itemCache, {
            ...item,
            edit: payload.edit,
          })
        }
    }

  }
}

export default startState => create(onDispatch, { ...initialState, ...startState })


