import { er, elements } from 'element-r'


const diffUtil = require('../diff_util.js').default

describe('Diff Util - diffUpdate', () => {

  describe('Root level node', () => {

    it('should replace a node', () => {
      const a = er('p', 'hello world')
      const b = er('div', 'hello world')
      const expected = b.outerHTML
      const res = diffUtil(a, b)

      expect(res.outerHTML).toEqual(expected)
    })

    it('should morph a node', () => {
      const a = er('p', 'hello world')
      const b = er('p', 'hello you')
      const expected = b.outerHTML
      const res = diffUtil(a, b)

      expect(res.outerHTML).toEqual(expected)
    })

    it('should morph a node with namespaced attribute', () => {
      const a = er('svg', '<use xlink:href="#heybooboo"></use>')
      const b = er('svg', '<use xlink:href="#boobear"></use>')
      const expected = b.outerHTML
      const res = diffUtil(a, b)

      expect(res.outerHTML).toEqual(expected)
    })

    it('should ignore if node is same', () => {
      const a = er('p', 'hello world')
      const expected = a.outerHTML
      const res = diffUtil(a, a)

      expect(res.outerHTML).toEqual(expected)
    })
  })

  describe('Nested child nodes', () => {
    it('should replace a node', () => {
      const a = er('main', er('p', 'hello world'))
      const b = er('main', er('div', 'hello world'))
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should replace a node', () => {
      const a = er('main', er('p', 'hello world'))
      const b = er('main', er('p', 'hello you'))
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should replace a node', () => {
      const a = er('main', er('p', 'hello world'))
      const res = diffUtil(a, a)
      const expected = a.outerHTML
      expect(res.outerHTML).equal(expected)
    })

    it('should append a node', () => {
      const a = er('main', '')
      const b = er('main', er('p', 'hello you'))
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should remove a node', () => {
      const a = er('main', er('p', 'hello you'))
      const b = er('main', '')
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should update child nodes', () => {
      const a = er('main', er('p', 'hello world'))
      const b = er('section', er('p', 'hello you'))
      const expected = '<main><p>hello you</p></main>'
      const res = diffUtil(a, b, { childrenOnly: true })
      expect(res.outerHTML).equal(expected)
    })

  })

  describe('Node values', () => {
    it('if new tree has no value and old tree does, remove value', () => {
      let a = er('input', { type:"text" value:"how"})
      let b = er('input', {type:"text"})
      let res = diffUtil(a, b)
      expect(res.getAttribute('value')).equal(null)
      expect(res.value, '').equal()

      a = er('input', {type:"text" value:"how"})
      b = er('input', {type:"text" value:null })
      res = diffUtil(a, b)
      expect(res.getAttribute('value')).equal(null)
      expect(res.value).equal('')
    })

    it('if new tree has value and old tree does too, set value from new tree', () => {
      let a = er('input', { type:"text" value:"how"})
      let b = er('input', {type:"text" value:"hi"})
      let res = diffUtil(a, b)

      expect(res.value).toEqual('hi')

      a = er('input')
      a.value = 'howdy'
      b = er('input')
      b.value = 'hi'
      res = diffUtil(a, b)

      expect(res.value).toEqual('hi')

      a = er('input', {type:"text" value: null})
      b = er('input', {type:"text"})
      b.value = 'hi'
      res = diffUtil(a, b)

      expect(res.value).toEqual('hi')

      a = er('input', 'type')
      a.value = 'howdy'
      b = er('input', {type:"text" value: 'hi'})
      res = diffUtil(a, b)
      
      expect(res.value).toEqual('hi')
    })

  })

  describe('Nodes are the same', () => {

    it('should return a if true', () => {
      const a = er('div', 'YOLO')
      const b = er('div', 'FOMO')
      b.isSameNode = el => (true)
      const res = diffUtil(a, b)

      expect(res.childNodes[0].data).toEqual('YOLO')
    })

    it('should return b if false', () => {
      const a = er('div', 'YOLO')
      const b = er('div', 'FOMO')
      b.isSameNode = el => (false)
      const res = diffUtil(a, b)

      expect(res.childNodes[0].data).toEqual('FOMO')
    })

  })

  describe('Node lists', () => {
    it('should append nodes', () => {
      const a = html`<ul></ul>`
      const b = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML, expected, 'result was expected')
    })

    it('should remove nodes', () => {
      const a = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      const b = html`<ul></ul>`
      const res = diffUtil(a, b)
      const expected = b.outerHTML
      expect(res.outerHTML).equal(expected)
    })

  })

  describe('Select and option nodes', () => {
    it('should append nodes', () => {
      const a = html`<select></select>`
      const b = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should append nodes (including optgroups)', () => {
      const a = html`<select></select>`
      const b = html`<select><optgroup><option>1</option><option>2</option></optgroup><option>3</option><option>4</option></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should remove nodes', () => {
      const a = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
      const b = html`<select></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should remove nodes (including optgroups)', () => {
      const a = html`<select><optgroup><option>1</option><option>2</option></optgroup><option>3</option><option>4</option></select>`
      const b = html`<select></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should add selected', () => {
      const a = html`<select><option>1</option><option>2</option></select>`
      const b = html`<select><option>1</option><option selected>2</option></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should add selected (xhtml)', () => {
      const a = html`<select><option>1</option><option>2</option></select>`
      const b = html`<select><option>1</option><option selected="selected">2</option></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should switch selected', () => {
      const a = html`<select><option selected="selected">1</option><option>2</option></select>`
      const b = html`<select><option>1</option><option selected="selected">2</option></select>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

  })

  describe('General node updates', () => {
    it('should replace nodes', () => {
      const a = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      const b = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      const expected = b.outerHTML
      const res = diffUtil(a, b)
      expect(res.outerHTML).equal(expected)
    })

    it('should replace nodes after multiple iterations', () => {
      let a = html`<ul></ul>`
      let b = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
      let expected = b.outerHTML

      a = diffUtil(a, b)
      expect(a.outerHTML).equal(expected)

      b = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
      expected = b.outerHTML

      a = diffUtil(a, b)
      expect(a.outerHTML).equal(expected)
    })
  })

  describe('Use id as a key hint', () => {
    it('append an element', () => {
      const a = html`<ul>
        <li id="a"></li>
        <li id="b"></li>
        <li id="c"></li>
      </ul>`
      const b = html`<ul>
        <li id="a"></li>
        <li id="new"></li>
        <li id="b"></li>
        <li id="c"></li>
      </ul>`
      const target = b.outerHTML

      const oldFirst = a.children[0]
      const oldSecond = a.children[1]
      const oldThird = a.children[2]

      const c = diffUtil(a, b)
      expect(oldFirst, c.children[0], 'first is equal').equal()
      expect(oldSecond, c.children[2], 'moved second is equal').equal()
      expect(oldThird, c.children[3], 'moved third is equal').equal()
      expect(c.outerHTML, target).equal()
    })

    it('handle non-id elements', () => {
      const a = html`<ul>
        <li></li>
        <li id="a"></li>
        <li id="b"></li>
        <li id="c"></li>
        <li></li>
      </ul>`
      const b = html`<ul>
        <li></li>
        <li id="a"></li>
        <li id="new"></li>
        <li id="b"></li>
        <li id="c"></li>
        <li></li>
      </ul>`
      const target = b.outerHTML

      const oldSecond = a.children[1]
      const oldThird = a.children[2]
      const oldForth = a.children[3]

      const c = diffUtil(a, b)
      expect(oldSecond, c.children[1], 'second is equal').equal()
      expect(oldThird, c.children[3], 'moved third is equal').equal()
      expect(oldForth, c.children[4], 'moved forth is equal').equal()
      expect(c.outerHTML, target).equal()
    })

    it('copy over children', () => {
      const a = html`<section>'hello'<section>`
      const b = html`<section><div></div><section>`
      const expected = b.outerHTML

      const c = diffUtil(a, b)
      expect(c.outerHTML, expected, expected).equal()
    })

    it('remove an element', () => {
      const a = html`<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>`
      const b = html`<ul><li id="a"></li><li id="c"></li></ul>`

      const oldFirst = a.children[0]
      const oldThird = a.children[2]
      const expected = b.outerHTML

      const c = diffUtil(a, b)

      expect(c.children[0], oldFirst, 'first is equal').equal()
      expect(c.children[1], oldThird, 'second untouched').equal()
      expect(c.outerHTML, expected).equal()
    })

    it('swap proxy elements', () => {
      const nodeA = html`<li id="a"></li>`
      const placeholderA = html`<div id="a" data-placeholder=true></div>`
      placeholderA.isSameNode = function (el) {
        return el === nodeA
      }

      const nodeB = html`<li id="b"></li>`
      const placeholderB = html`<div id="b" data-placeholder=true></div>`
      placeholderB.isSameNode = function (el) {
        return el === nodeB
      }

      const a = html`<ul>${nodeA}${nodeB}</ul>`
      const b = html`<ul>${placeholderB}${placeholderA}</ul>`
      const c = diffUtil(a, b)

      expect(c.children[0], nodeB, 'c.children[0] === nodeB').equal()
      expect(c.children[1], nodeA, 'c.children[1] === nodeA').equal()
    })

    it('id match still morphs', () => {
      const a = html`<li id="12">FOO</li>`
      const b = html`<li id="12">BAR</li>`
      const target = b.outerHTML
      const c = diffUtil(a, b)
      expect(c.outerHTML, target).equal()
    })

    it('remove orphaned keyed nodes', () => {
      const a = html`
        <div>
          <div>1</div>
          <li id="a">a</li>
        </div>
      `
      const b = html`
        <div>
          <div>2</div>
          <li id="b">b</li>
        </div>
      `
      const expected = b.outerHTML
      const c = diffUtil(a, b)

      expect(c.outerHTML, expected).equal()
    })

    it('whitespace', () => {
      var a = html`<ul></ul>`
      var b = html`<ul><li></li><li></li></ul>`
      var expected = b.outerHTML
      var c = diffUtil(a, b)

      expect(c.outerHTML, expected).equal()
    })

    it('nested with id', () => {
      const child = html`<div id="child"></div>`
      const placeholder = html`<div id="child"></div>`
      placeholder.isSameNode = function (el) { return el === child }

      const a = html`<div><div id="parent">${child}</div></div>`
      const b = html`<div><div id="parent">${placeholder}</div></div>`

      const c = diffUtil(a, b)

      expect(c.children[0].children[0]).equal(child)
    })

    it('nested without id', () => {
      const child = html`<div id="child">child</div>`
      const placeholder = html`<div id="child">placeholder</div>`
      placeholder.isSameNode = function (el) { return el === child }

      const a = html`<div><div>${child}</div></div>`
      const b = html`<div><div>${placeholder}</div></div>`

      const c = diffUtil(a, b)

      expect(c.children[0].children[0], ).equal(child)
    })

  })

  describe('fragments', () => {
    it('disallow document fragments', () => {

    })

    it('allow document fragments with `childrenOnly`', () => {

    })
  })

})



