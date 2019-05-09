import BaseType from '../base'
import { typesOverride, capitalize, clearObj, isObj } from 'jTUtils'
import { Schema, Values } from 'jTConstants'
import { List } from '../../components'


 const tottleSize = () => {
    setTimeout(() => {
      const refNode = schema.component
      if(!refNode) return
      const isOpen = props.schema.open

      if(isOpen || !this.styles.closed.maxHeight){
        this.styles.closed.maxHeight = this.styles.closed.maxHeight || `${refNode.scrollHeight}px`
        this.setStyle(refNode, this.styles.closed)
      }
      else if(!isOpen && this.styles.open.maxHeight){
        this.setStyle(refNode, this.styles.open)
        console.log('------------------ope to cloased------------------');
        console.log(refNode.style);
      }

      setTimeout(() => {
        
        requestAnimationFrame(() => {

            if(isOpen){
              const childsLength = Array.from(refNode.children).length
              const { closed } = this.styles
              const initHeight = parseInt(closed.maxHeight, 10)
              const openHeight = initHeight + (childsLength * initHeight)
              
              this.styles.open.maxHeight = `${openHeight}px`
              this.styles.open.height = `${openHeight}px`
              this.setStyle(refNode, this.styles.open)
            }
            else {
              this.setStyle(refNode, this.styles.closed)
            }


        })
      }, 0)

    }, 0)
 }
 
class MapType extends BaseType {

  static priority = 1
  static eval = value => typeof value === 'object' && !Array.isArray(value)

  constructor(config){
    super({ ...config })
  }
  
  styles = { closed: {}, open: {} }
  
  onToggle = (e, Editor) => {
    const id = e.currentTarget.getAttribute(Values.DATA_TREE_ID)
    if(!id) return

    const schema = Editor.schema(id)
    const update = { open: !schema.open }
    if(!update.open){
      this.setStyle(schema.component, this.styles.closed)
      return setTimeout(() => Editor.update(id, update), 500)
    }
    
    Editor.update(id, update)
  }
  
  setStyle = (domEl, styles) => {
    domEl && isObj(styles) && Object
    .entries(styles)
    .map(([ rule, value ]) => domEl.style[rule] = value)
    
  }
  
  setClosedHeight = (refNode) => {
    if(!refNode || refNode.style.maxHeight) return

    this.styles.closed.maxHeight = this.styles.closed.maxHeight || `${refNode.scrollHeight}px`
    this.setStyle(refNode, this.styles.closed)
  }
  
  setOpenHeight = (schema) => {
    setTimeout(() => {
      const refNode = schema.component
      this.setClosedHeight(refNode)
      
      schema.open && setTimeout(() => {
        if(!refNode) return

        const childsHeight = Array
          .from(refNode.firstChild.children)
          .reduce((height, child) => {
            height+= child.scrollHeight || 0
            return height
          }, 0)

        const { closed } = this.styles
        const initHeight = parseInt(closed.maxHeight, 10)
        const openHeight = initHeight + childsHeight
        this.styles.open.maxHeight = `${openHeight}px`
        this.setStyle(refNode, this.styles.open)
      }, 0)
      
    }, 0)
  }
  
  // componentDidMount = (props, Editor) => {

  //   props.parent && this.setClosedHeight(props.schema.component)
  // }
  
  componentDidUpdate = (props, Editor) => {

    const { schema } = props
    const refNode = schema.component
    this.buildEvents(schema, refNode)
    const { parent, instance, component, ...original } = schema
    this.original = original
    // Clear out the updated, because the component just updated
    this.updated && clearObj(this.updated)

    if(props.schema.open || !this.styles.closed.maxHeight)
      this.setOpenHeight(schema)
  }

  render = props => {

    const { schema: { id, key, value, mode, matchType }, children } = props
    const isRoot = props.schema.key === Schema.ROOT
    // const isOpen = props.schema.open || isRoot
    const isOpen = props.schema.open
    const classes = isOpen && `list-open` || ''

    return List({
      id,
      key,
      value,
      mode,
      classes,
      isOpen,
      isRoot,
      styles: {
        wrapper: this.styles.closed,
      },
      children,
      type: matchType,
      showLabel: true,
      valueEl: 'select',
      keyInput: 'text',
      ...this.getActions(mode),
      onToggle: this.onToggle
    })
  }


}

export default MapType