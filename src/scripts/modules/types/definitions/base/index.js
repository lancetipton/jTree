import { Values } from '../../../../constants'
import { er, elements } from 'element-r'
const { div, br, span } = elements

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
  
  render = props => {
    return div({ className: `string-div` },
      span(`Key: ${props.schema.key}`),
      br(),
      span(`Value: ${props.schema.value}`),
    )
  }
  
}


export default BaseType