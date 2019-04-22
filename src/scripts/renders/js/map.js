
class MapRender extends HTMLElement {
  constructor(params) {
    super(params)
    const { settings: { Editor }, value, key, parent, pos, schema } = params
    this.$root = document.createElement('div')
    this.$root.innerHTML = 'This is a test'
    this._shadowRoot = this.attachShadow({ 'mode': 'closed' })
    this._shadowRoot.appendChild(this.$root)
    this.open(false)
  }
  
  connectedCallback() {
    console.log('connected!')
  }

  disconnectedCallback() {
    console.log('disconnected!')
  }

  attributeChangedCallback(name, oldVal, newVal) {
    console.log(`Attribute: ${name} changed!`)
  }

  adoptedCallback() {
    console.log('adopted!')
  }

  open = (val) => {
    if(val === false) this.removeAttribute('open')
    else if(val) this.setAttribute('open', '')
    else {
      this.hasAttribute('open')
        ? this.removeAttribute('open')
        : this.setAttribute('open', '')
    }
  }

  render = (props) => {
    const { settings: { Editor }, value, key, parent, pos, schema } = props
    Editor.element.appendChild(this)
    this.addEventListener('click', () => { this.open() })
  }

  static get observedAttributes() {
    return ['open']
  }


}
customElements.define('map-render', MapRender)

export default MapRender
 