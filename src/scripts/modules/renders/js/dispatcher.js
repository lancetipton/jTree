import cloneDeep from 'lodash.clonedeep'

const WATCHERS = {} 
let ON_DISPATCH
let STATE
const isFunc = test => typeof test === 'function'
const destroy = () => (
  Object
    .entries(WATCHERS)
    .map(([id, cbs]) =>  {
      cbs && cbs.map(cb => cb && typeof cb.destroy === 'function' && cb.destroy(id))
      WATCHERS[watcher] = undefined
      delete WATCHERS[watcher]
    })
)
const dispatch = (id, ...payload) => {
  if(!ON_DISPATCH)
    return console.warn(`You must create a store before you can dispatch to it`)

  return update(
    ON_DISPATCH(STATE, id, ...payload),
    id
  )
}

const create = (onDispatch, state) => {
  if(ON_DISPATCH || STATE)
    return console.warn(`dispatcher.create should only be call once for an application`)
    
  if(!onDispatch || !isFunc(onDispatch))
    return console.warn(`dispatcher.create requires an 'onDispatch' method`)
  if(!state || typeof store !== 'object')
    return console.warn(`create requires an initial state of type 'object'`)

  ON_DISPATCH = onDispatch
  STATE = cloneDeep(state)
  return STATE
}

/**
 * Checks the state for an update, and updates when needed
 * Calls all cbs linked to the passed in id
 * @param  {any} updatedState - new changes
 * @param  {any} id - used to find the linked callbacks
 * @param  {any} key - used to find the location of the state that was updated
 * @return { void }
 */
const update = (updatedState, id) => {
  // If no updated state, or the current state is equal to the update state
  // No update, so just return
  if(!updatedState || STATE === updatedState)
    return STATE

  // Otherwise update the state with the updateState param
  STATE = { ...STATE, ...updatedState }

  const cbs = WATCHERS[id]
  cbs &&
    cbs.length &&
    cbs.map(cb => typeof cb === 'function' && cb(STATE))
  
  return STATE
}

const watch = (id, cb) => {
  if (!cb || typeof cb !== `function`)
    console.warn(`You must pass a function as the second argument to store.listen()`)

  WATCHERS[id] = WATCHERS[id] || []
  WATCHERS[id].push(cb)
}

const getWatchers = () => WATCHERS

const forget = (id, cb) => {
  if(!id || !WATCHERS[id])
    console.warn(`You must pass and id to forget a watcher`)

  const cbIndex = WATCHERS[id].indexOf(cb)
  cbIndex !== -1 && WATCHERS[id].splice(cbIndex, 1);
}

const dispatcher = {
  create,
  destroy,
  dispatch,
  forget,
  getWatchers,
  watch,
  update
}

export default dispatcher