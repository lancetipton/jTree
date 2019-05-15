import { eR, elements } from 'element-r'
const differ = require('../diff_util.js')
const diffUtil = differ.diffUpdate

describe('Diff Util - diffUpdate', () => {

  describe('Root level node', () => {

    it('should replace a node', () => {
      const newNode = eR('p', 'Mr. Goat 4 Pres')
      const oldNode = eR('div', 'Mr. Goat 4 Pres')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res.outerHTML).toEqual(expected)
    })

    it('should morph a node', () => {
      const newNode = eR('p', 'Mr. Goat 4 Pres')
      const oldNode = eR('p', 'Goats Breath')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should morph a node with namespaced attribute', () => {
      const newNode = eR('svg', '<use xlink:href="#heybooboo"></use>')
      const oldNode = eR('svg', '<use xlink:href="#boobear"></use>')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should ignore if node is same', () => {
      const newNode = eR('p', 'Mr. Goat 4 Pres')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, newNode)

      expect(res.outerHTML).toEqual(expected)
    })
  })

  describe('Nested child nodes', () => {

    it('should replace a node', () => {
      const newNode = eR('main', eR('p', 'Mr. Goat 4 Pres'))
      const oldNode = eR('main', eR('div', 'Mr. Goat 4 Pres'))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should replace a node', () => {
      const newNode = eR('main', eR('p', 'Mr. Goat 4 Pres'))
      const oldNode = eR('main', eR('p', 'Goats Breath'))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should replace a node', () => {
      const newNode = eR('main', eR('p', 'Mr. Goat 4 Pres'))
      const oldNode = eR('main', eR('div', 'hello stuff'))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should append a node', () => {
      const newNode = eR('main', eR('p', 'Goats Breath'))
      const oldNode = eR('main', '')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should remove a node', () => {
      const newNode = eR('main', '')
      const oldNode = eR('main', eR('p', 'Goats Breath'))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should update child nodes', () => {
      const newNode = eR('section', eR('p', 'Goats Breath'))
      const oldNode = eR('main', eR('p', 'Mr. Goat 4 Pres'))
      const expected = '<main><p>Goats Breath</p></main>'
      const res = diffUtil(newNode, oldNode, { childrenOnly: true })

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

  })

  // describe('Node values', () => {
  //   it('if new tree has no value and old tree does, remove value', () => {
  //     let newNode = eR('input', { type:"text", value:"how"})
  //     let oldNode = eR('input', {type:"text"})
  //     let res = diffUtil(newNode, oldNode)
  //     expect(res.getAttribute('value')).toEqual(null)
  //     expect(res.value, '').toEqual()

  //     newNode = eR('input', {type:"text", value:"how"})
  //     oldNode = eR('input', {type:"text", value:null })
  //     res = diffUtil(newNode, oldNode)
  //     expect(res.getAttribute('value')).toEqual(null)
  //     expect(res.value).toEqual('')
  //   })

  //   it('if new tree has value and old tree does too, set value from new tree', () => {
  //     let newNode = eR('input', { type:"text", value:"how"})
  //     let oldNode = eR('input', {type:"text", value:"hi"})
  //     let res = diffUtil(newNode, oldNode)

  //     expect(res.value).toEqual('hi')

  //     newNode = eR('input')
  //     newNode.value = 'howdy'
  //     oldNode = eR('input')
  //     oldNode.value = 'hi'
  //     res = diffUtil(newNode, oldNode)

  //     expect(res.value).toEqual('hi')

  //     newNode = eR('input', {type:"text", value: null})
  //     oldNode = eR('input', {type:"text"})
  //     oldNode.value = 'hi'
  //     res = diffUtil(newNode, oldNode)

  //     expect(res.value).toEqual('hi')

  //     newNode = eR('input', 'type')
  //     newNode.value = 'howdy'
  //     oldNode = eR('input', {type:"text", value: 'hi'})
  //     res = diffUtil(newNode, oldNode)
      
  //     expect(res.value).toEqual('hi')
  //   })

  // })

  // describe('Nodes are the same', () => {

  //   it('should return a if true', () => {
  //     const newNode = eR('div', 'YOLO')
  //     const oldNode = eR('div', 'FOMO')
  //     oldNode.isSameNode = el => (true)
  //     const res = diffUtil(newNode, oldNode)

  //     expect(res.childNodes[0].data).toEqual('YOLO')
  //   })

  //   it('should return b if false', () => {
  //     const newNode = eR('div', 'YOLO')
  //     const oldNode = eR('div', 'FOMO')
  //     oldNode.isSameNode = el => (false)
  //     const res = diffUtil(newNode, oldNode)

  //     expect(res.childNodes[0].data).toEqual('FOMO')
  //   })

  // })

  // describe('Node lists', () => {
  //   it('should append nodes', () => {
  //     const newNode = html`<ul></ul>`
  //     const oldNode = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML, expected, 'result was expected')
  //   })

  //   it('should remove nodes', () => {
  //     const newNode = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
  //     const oldNode = html`<ul></ul>`
  //     const res = diffUtil(newNode, oldNode)
  //     const expected = oldNode.outerHTML
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  // })

  // describe('Select and option nodes', () => {
  //   it('should append nodes', () => {
  //     const newNode = html`<select></select>`
  //     const oldNode = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should append nodes (including optgroups)', () => {
  //     const newNode = html`<select></select>`
  //     const oldNode = html`<select><optgroup><option>1</option><option>2</option></optgroup><option>3</option><option>4</option></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should remove nodes', () => {
  //     const newNode = html`<select><option>1</option><option>2</option><option>3</option><option>4</option></select>`
  //     const oldNode = html`<select></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should remove nodes (including optgroups)', () => {
  //     const newNode = html`<select><optgroup><option>1</option><option>2</option></optgroup><option>3</option><option>4</option></select>`
  //     const oldNode = html`<select></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should add selected', () => {
  //     const newNode = html`<select><option>1</option><option>2</option></select>`
  //     const oldNode = html`<select><option>1</option><option selected>2</option></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should add selected (xhtml)', () => {
  //     const newNode = html`<select><option>1</option><option>2</option></select>`
  //     const oldNode = html`<select><option>1</option><option selected="selected">2</option></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should switch selected', () => {
  //     const newNode = html`<select><option selected="selected">1</option><option>2</option></select>`
  //     const oldNode = html`<select><option>1</option><option selected="selected">2</option></select>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  // })

  // describe('General node updates', () => {
  //   it('should replace nodes', () => {
  //     const newNode = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
  //     const oldNode = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
  //     const expected = oldNode.outerHTML
  //     const res = diffUtil(newNode, oldNode)
  //     expect(res.outerHTML).toEqual(expected)
  //   })

  //   it('should replace nodes after multiple iterations', () => {
  //     let newNode = html`<ul></ul>`
  //     let oldNode = html`<ul><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul>`
  //     let expected = oldNode.outerHTML

  //     newNode = diffUtil(newNode, oldNode)
  //     expect(newNode.outerHTML).toEqual(expected)

  //     oldNode = html`<ul><div>1</div><li>2</li><p>3</p><li>4</li><li>5</li></ul>`
  //     expected = oldNode.outerHTML

  //     newNode = diffUtil(newNode, oldNode)
  //     expect(newNode.outerHTML).toEqual(expected)
  //   })
  // })

  // describe('Use id as a key hint', () => {
  //   it('append an element', () => {
  //     const newNode = html`<ul>
  //       <li id="a"></li>
  //       <li id="b"></li>
  //       <li id="c"></li>
  //     </ul>`
  //     const oldNode = html`<ul>
  //       <li id="a"></li>
  //       <li id="new"></li>
  //       <li id="b"></li>
  //       <li id="c"></li>
  //     </ul>`
  //     const target = oldNode.outerHTML

  //     const oldFirst = newNode.children[0]
  //     const oldSecond = newNode.children[1]
  //     const oldThird = newNode.children[2]

  //     const c = diffUtil(newNode, oldNode)
  //     expect(oldFirst, c.children[0], 'first is equal').toEqual()
  //     expect(oldSecond, c.children[2], 'moved second is equal').toEqual()
  //     expect(oldThird, c.children[3], 'moved third is equal').toEqual()
  //     expect(c.outerHTML, target).toEqual()
  //   })

  //   it('handle non-id elements', () => {
  //     const newNode = html`<ul>
  //       <li></li>
  //       <li id="a"></li>
  //       <li id="b"></li>
  //       <li id="c"></li>
  //       <li></li>
  //     </ul>`
  //     const oldNode = html`<ul>
  //       <li></li>
  //       <li id="a"></li>
  //       <li id="new"></li>
  //       <li id="b"></li>
  //       <li id="c"></li>
  //       <li></li>
  //     </ul>`
  //     const target = oldNode.outerHTML

  //     const oldSecond = newNode.children[1]
  //     const oldThird = newNode.children[2]
  //     const oldForth = newNode.children[3]

  //     const c = diffUtil(newNode, oldNode)
  //     expect(oldSecond, c.children[1], 'second is equal').toEqual()
  //     expect(oldThird, c.children[3], 'moved third is equal').toEqual()
  //     expect(oldForth, c.children[4], 'moved forth is equal').toEqual()
  //     expect(c.outerHTML, target).toEqual()
  //   })

  //   it('copy over children', () => {
  //     const newNode = html`<section>'hello'<section>`
  //     const oldNode = html`<section><div></div><section>`
  //     const expected = oldNode.outerHTML

  //     const c = diffUtil(newNode, oldNode)
  //     expect(c.outerHTML, expected, expected).toEqual()
  //   })

  //   it('remove an element', () => {
  //     const newNode = html`<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>`
  //     const oldNode = html`<ul><li id="a"></li><li id="c"></li></ul>`

  //     const oldFirst = newNode.children[0]
  //     const oldThird = newNode.children[2]
  //     const expected = oldNode.outerHTML

  //     const c = diffUtil(newNode, oldNode)

  //     expect(c.children[0], oldFirst, 'first is equal').toEqual()
  //     expect(c.children[1], oldThird, 'second untouched').toEqual()
  //     expect(c.outerHTML, expected).toEqual()
  //   })

  //   it('swap proxy elements', () => {
  //     const nodeA = html`<li id="a"></li>`
  //     const placeholderA = html`<div id="a" data-placeholder=true></div>`
  //     placeholderA.isSameNode = function (el) {
  //       return el === nodeA
  //     }

  //     const nodeB = html`<li id="b"></li>`
  //     const placeholderB = html`<div id="b" data-placeholder=true></div>`
  //     placeholderB.isSameNode = function (el) {
  //       return el === nodeB
  //     }

  //     const newNode = html`<ul>${nodeA}${nodeB}</ul>`
  //     const oldNode = html`<ul>${placeholderB}${placeholderA}</ul>`
  //     const c = diffUtil(newNode, oldNode)

  //     expect(c.children[0], nodeB, 'c.children[0] === nodeB').toEqual()
  //     expect(c.children[1], nodeA, 'c.children[1] === nodeA').toEqual()
  //   })

  //   it('id match still morphs', () => {
  //     const newNode = html`<li id="12">FOO</li>`
  //     const oldNode = html`<li id="12">BAR</li>`
  //     const target = oldNode.outerHTML
  //     const c = diffUtil(newNode, oldNode)
  //     expect(c.outerHTML, target).toEqual()
  //   })

  //   it('remove orphaned keyed nodes', () => {
  //     const newNode = html`
  //       <div>
  //         <div>1</div>
  //         <li id="a">a</li>
  //       </div>
  //     `
  //     const oldNode = html`
  //       <div>
  //         <div>2</div>
  //         <li id="b">b</li>
  //       </div>
  //     `
  //     const expected = oldNode.outerHTML
  //     const c = diffUtil(newNode, oldNode)

  //     expect(c.outerHTML, expected).toEqual()
  //   })

  //   it('whitespace', () => {
  //     var newNode = html`<ul></ul>`
  //     var oldNode = html`<ul><li></li><li></li></ul>`
  //     var expected = oldNode.outerHTML
  //     var c = diffUtil(newNode, oldNode)

  //     expect(c.outerHTML, expected).toEqual()
  //   })

  //   it('nested with id', () => {
  //     const child = html`<div id="child"></div>`
  //     const placeholder = html`<div id="child"></div>`
  //     placeholder.isSameNode = function (el) { return el === child }

  //     const newNode = html`<div><div id="parent">${child}</div></div>`
  //     const oldNode = html`<div><div id="parent">${placeholder}</div></div>`

  //     const c = diffUtil(newNode, oldNode)

  //     expect(c.children[0].children[0]).toEqual(child)
  //   })

  //   it('nested without id', () => {
  //     const child = html`<div id="child">child</div>`
  //     const placeholder = html`<div id="child">placeholder</div>`
  //     placeholder.isSameNode = function (el) { return el === child }

  //     const newNode = html`<div><div>${child}</div></div>`
  //     const oldNode = html`<div><div>${placeholder}</div></div>`

  //     const c = diffUtil(newNode, oldNode)

  //     expect(c.children[0].children[0], ).toEqual(child)
  //   })

  // })

  // describe('fragments', () => {
  //   it('disallow document fragments', () => {

  //   })

  //   it('allow document fragments with `childrenOnly`', () => {

  //   })
  // })

})



