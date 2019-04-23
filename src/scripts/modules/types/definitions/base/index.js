import { Values } from '../../../../constants'

const updateParentConstruct = (config, parent) => {
  Object.entries(Values.PARENT_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && parent[key] !== config[key])
      parent[key] = config[key]
  })
}

class BaseType {

  static priority = 0
  static matchHelper = () => {}
  static eval = (value) => (typeof value === 'string')

  constructor(config){
    config && updateParentConstruct(config, this.constructor)
  }

  build = (params) => {
    
  }
}


export default BaseType