const removeItem = (items, type='shift') => {
  const key = Object.keys(items)[type]()
  if(!key) return

  const item = items[key]
  delete items[key]

  return item
}

const getItem = (items, type='shift') => {
  return removeItem(items, type)
}

const addItem = (items, item, limit) => {
  const keys = Object.keys(items)
  if(keys.length >= limit) removeItem(items)
  
  items[new Date().getTime()] = item
}


const buildUndo = (config) => {

  const isUndo = type => (
    type === 'undo' || !USE_REDO
  )

  let UNDO_ITEMS = {}
  let REDO_ITEMS = {}
  let UNDO_LIMIT = 0
  let REDO_LIMIT = 0
  let USE_REDO = false

  class UndoManager {
    
    constructor(config){
      UNDO_LIMIT = config.limit || 1
      if(!config.redo) return this

      REDO_LIMIT = config.redoLimit || UNDO_LIMIT
      USE_REDO = config.redo || false
    }

    has = type => (
      isUndo(type)
        ? Boolean(Object.keys(UNDO_ITEMS).length)
        : Boolean(Object.keys(REDO_ITEMS).length)
    )
    
    get = type => (
      isUndo(type)
        ? UNDO_ITEMS
        : type === 'redo'
          ? REDO_ITEMS
          : { undo: UNDO_ITEMS, redo: REDO_ITEMS }
    )

    setLimit = (limit, type) => (
      isUndo(type)
        ? (UNDO_LIMIT = limit)
        : (REDO_LIMIT = limit)
    )

    add = (item, type) => (
      isUndo(type)
        ? addItem(UNDO_ITEMS, item, UNDO_LIMIT)
        : addItem(REDO_ITEMS, item, REDO_LIMIT || UNDO_LIMIT)
    )

    undo = () => {
      const item = getItem(UNDO_ITEMS)
      if(!item) return null
      USE_REDO && addItem(REDO_ITEMS, item)

      return item
    }

    redo = () => {
      if(!USE_REDO) return null

      const item = getItem(REDO_ITEMS)
      if(!item) return null
      addItem(UNDO_ITEMS, item)

      return items
    }

    clear = type => (
      type === 'undo'
        ? (UNDO_ITEMS = {})
        : type === 'redo'
          ? (REDO_ITEMS = {})
          : (UNDO_ITEMS = {}) || (REDO_ITEMS = {}) 
    )

    destroy = () => {
      UNDO_ITEMS = undefined
      REDO_ITEMS = undefined
      UNDO_LIMIT = undefined
      REDO_LIMIT = undefined
      USE_REDO = undefined
      Object.keys(this).map(key => {
        try {
          this[key] = undefined
          delete this[key]
        }
        catch(e){}
      }) 
    }

  }
  
  return new UndoManager(config)
}


export default buildUndo