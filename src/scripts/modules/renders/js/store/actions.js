const actions = [
  'ADD_DATA',
  'UPDATE_ITEM',
  'UPDATE_SELECTED',
  'UPDATE_EXPANDED',
  'UPDATE_EDIT'
].reduce((actions, action) => (
  (actions[action.toUpperCase()] = action.toUpperCase()) && actions
), {})

export default actions