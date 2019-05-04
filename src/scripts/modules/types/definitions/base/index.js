import { buildTheme } from '../../styles/build_theme'
import { Values } from 'jTConstants'
import { er, elements } from 'element-r'
const { div, br, span } = elements


const updateParentConstruct = (config, parent) => {
  Object.entries(Values.PARENT_OVERWRITE).map(([ key, type ]) => {
    if(typeof config[key] === type && parent[key] !== config[key])
      parent[key] = config[key]
  })
}

let STYLES_LOADED
class BaseType {

  static priority = 0
  static matchHelper = () => {}
  static eval = (value) => (typeof value === 'string')

  static getStyles = (settings) => buildTheme(settings)
  
  constructor(config){
    config && updateParentConstruct(config, this.constructor)
  }

  shouldComponentUpdate = (params) => {
    
  }
  
  render = props => {
    return div({ className: `base-wrapper wrapper` },
      span(`Key: ${props.schema.key}`),
      br(),
      span(`Value: ${props.schema.value}`),
    )
  }
  
}


export default BaseType