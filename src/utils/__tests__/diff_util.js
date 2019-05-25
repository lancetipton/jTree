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

  describe('Node values', () => {

    it('if new tree has no value and old tree does, remove value', () => {
      const newNode = eR('input', { type:"text", value:"goat"})
      const oldNode = eR('input', {type:"text"})
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.getAttribute('value')).toEqual('goat')
    })
    
    it('should set value to null when new value is null', () => {
      const newNode = eR('input', {type:"text", value:null })
      const oldNode = eR('input', {type:"text", value:"Goat"})
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.getAttribute('value')).toEqual(null)
    })

    it('should set value when value is defined through it property', () => {
      const newNode = eR('input')
      newNode.value = 'Goat'
      const oldNode = eR('input')
      oldNode.value = 'Cow'
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.value).toEqual('Goat')
    })

    it('should set value when value is defined through it poperty on the old node', () => {
      const newNode = eR('input', {type:"text", value: null})
      const oldNode = eR('input', {type:"text"})
      oldNode.value = 'Cow'
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.value).toEqual('')
    })

    it('should set value when value is defined through it poperty on the new node', () => {
      const newNode = eR('input', 'type')
      newNode.value = 'Goat'
      const oldNode = eR('input', {type:"text", value: 'Cow'})
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.value).toEqual('Goat')
    })

    it('if new tree has value and old tree does too, set value from new tree', () => {
      const newNode = eR('input', { type:"text", value:"Goat"})
      const oldNode = eR('input', {type:"text", value:"Cow"})
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.value).toEqual('Goat')
    })

  })

  describe('Nodes are the same', () => {

    it('should return a if true', () => {
      const newNode = eR('div', 'Mr. Goat')
      const oldNode = eR('div', 'Brown Cow')
      oldNode.isSameNode = el => (true)
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.childNodes[0].data).toEqual('Mr. Goat')
    })

    it('should return newNode if not the same node', () => {
      const newNode = eR('div', 'Mr. Goat')
      const oldNode = eR('div', 'Brown Cow')
      oldNode.isSameNode = el => (false)
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(newNode)
      expect(res.childNodes[0].data).toEqual('Mr. Goat')
    })

  })

  describe('Node lists', () => {

    it('should append nodes', () => {
      const newNode = eR(`ul`, eR(`li`, 1), eR(`li`, 2), eR(`li`, 3), eR(`li`, 4), eR(`li`, 5))
      const oldNode = eR(`ul`)
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should remove nodes', () => {
      const newNode = eR(`ul`)  
      const oldNode = eR(`ul`, eR(`li`, 1), eR(`li`, 2), eR(`li`, 3), eR(`li`, 4), eR(`li`, 5))
      const res = diffUtil(newNode, oldNode)
      const expected = newNode.outerHTML

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

  })

  describe('Select and option nodes', () => {
    it('should append nodes', () => {
      const newNode = eR('select', eR('option', 1), eR('option', 2), eR('option', 3))
      const oldNode = eR('select')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should append nodes (including optgroups)', () => {
      const newNode = eR('select',
        eR('optgroup', eR('option', 1), eR('option', 2), eR('option', 3)),
        eR('option', 4), eR('option', 5)
      )
      const oldNode = eR('select')
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should remove nodes', () => {
      const newNode = eR('select')
      const oldNode = eR('select', eR('option', 1), eR('option', 2), eR('option', 3))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should remove nodes (including optgroups)', () => {
      const newNode = eR('select')
      const oldNode = eR('select',
        eR('optgroup', eR('option', 1), eR('option', 2), eR('option', 3)),
        eR('option', 4), eR('option', 5)
      )
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should add selected', () => {
      const newNode = eR('select', eR('option', 1), eR('option', { selected: true }, 2), eR('option', 3))
      const oldNode = eR('select', eR('option', 1), eR('option', 2), eR('option', 3))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should switch selected', () => {
      const newNode = eR('select', eR('option', 1), eR('option', { selected: true }, 2), eR('option', 3))
      const oldNode = eR('select', eR('option', { selected: true }, 1), eR('option', 2), eR('option', 3))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

  })

  describe('General node updates', () => {
    it('should replace nodes', () => {
      const newNode = eR(`ul`, eR(`li`, 1), eR(`li`, 2), eR(`li`, 3), eR(`li`, 4), eR(`li`, 5))
      const oldNode = eR(`ul`, eR(`div`, 1), eR(`li`, 2), eR(`li`, 3), eR(`li`, 4), eR(`li`, 5))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should replace nodes after multiple iterations', () => {
      let newNode = eR(`ul`)
      let oldNode = eR(`ul`, eR(`li`, 1), eR(`li`, 2), eR(`li`, 3), eR(`li`, 4), eR(`li`, 5))
      let expected = newNode.outerHTML
      let res = diffUtil(newNode, oldNode)
      
      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
      
      oldNode = eR(`ul`, eR(`div`, 1), eR(`li`, 2), eR(`li`, 3), eR(`li`, 4), eR(`li`, 5))
      res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })
  })

  describe('Use id as a key hint', () => {
    it('should append an element', () => {
      const newNode = eR(`ul`,
        eR(`li`, { id:`1` }, 1),
        eR(`li`, { id:`goat` }, `goat`),
        eR(`li`, { id:`2` }, 2),
        eR(`li`, { id:`3` }, 3),
      )
      const oldNode = eR(`ul`,
        eR(`li`, { id:`1` }, 1),
        eR(`li`, { id:`2` }, 2),
        eR(`li`, { id:`3` }, 3),
      )

      const newHtml = newNode.outerHTML
      const oldFirstId = oldNode.children[0].id
      const oldSecondId = oldNode.children[1].id
      const oldThirdId = oldNode.children[2].id
      const oldFirstText = oldNode.children[0].textContent
      const oldSecondText = oldNode.children[1].textContent
      const oldThirdText = oldNode.children[2].textContent
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(oldFirstId).toEqual(res.children[0].id)
      expect(oldSecondId).toEqual(res.children[2].id)
      expect(oldThirdId).toEqual(res.children[3].id)

      expect(oldFirstText).toEqual(res.children[0].textContent)
      expect(oldSecondText).toEqual(res.children[2].textContent)
      expect(oldThirdText).toEqual(res.children[3].textContent)
      expect(res.outerHTML).toEqual(newHtml)
    })

    it('should handle non-id elements', () => {
      const newNode = eR(`ul`,
        eR(`li`, 'Mr. Goat'),
        eR(`li`, { id:`1` }, 1),
        eR(`li`, { id:`goat` }, `goat`),
        eR(`li`, { id:`2` }, 2),
        eR(`li`, { id:`3` }, 3),
        eR(`li`, 4),
      )
      const oldNode = eR(`ul`,
        eR(`li`, { id:`1` }, 1),
        eR(`li`, { id:`2` }, 2),
        eR(`li`, { id:`3` }, 3),
      )

      const newHtml = newNode.outerHTML
      const oldFirstId = oldNode.children[0].id
      const oldSecondId = oldNode.children[1].id
      const oldThirdId = oldNode.children[2].id
      const oldFirstText = oldNode.children[0].textContent
      const oldSecondText = oldNode.children[1].textContent
      const oldThirdText = oldNode.children[2].textContent
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(oldFirstId).toEqual(res.children[1].id)
      expect(oldSecondId).toEqual(res.children[3].id)
      expect(oldThirdId).toEqual(res.children[4].id)

      expect(oldFirstText).toEqual(res.children[1].textContent)
      expect(oldSecondText).toEqual(res.children[3].textContent)
      expect(oldThirdText).toEqual(res.children[4].textContent)
      expect(res.outerHTML).toEqual(newHtml)
      
    })

    it('should replace children when not the same', () => {
      const newNode = eR(`section`, `hello`)
      const oldNode = eR(`section`, eR(`div`))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should remove a child element when it dosnt exist', () => {
      const newNode = eR(`ul`, eR(`li`, { id:`a` }), eR(`li`, { id: `c` }))
      const oldNode = eR(`ul`,
        eR(`li`, { id:`a` }),
        eR(`li`, { id: `b` }),
        eR(`li`, { id: `c` })
      )

      const oldFirstId = oldNode.children[0].id
      const oldThirdId = oldNode.children[2].id
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.children[0].id).toEqual(oldFirstId)
      expect(res.children[1].id).toEqual(oldThirdId)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should swap proxy elements based on id even when not the same element', () => {
      const goatNode = eR(`li`, { id: `goat` })
      const cowNode =  eR(`li`, { id: `cow` })
      const setFirstNode = eR(`div`, { id: `goat`, 'data-placeholder': true })
      setFirstNode.isSameNode = el => (el === setFirstNode)
      
      const setSecondNode = eR(`div`, { id: `cow`, 'data-placeholder': true })
      setSecondNode.isSameNode = el => (el === setSecondNode)
      
      const newNode = eR(`ul`, goatNode, cowNode)
      const oldNode = eR(`ul`, setSecondNode, setFirstNode)
      
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.children[0]).toEqual(goatNode)
      expect(res.children[1]).toEqual(cowNode)
    })

    it('should still diff and update when id matchs', () => {
      const goatNode = eR(`div`, { id: `goat` }, 'I am Goat')
      const cowNode = eR(`div`, { id: `goat` }, 'I am Cow')
      const expected = goatNode.outerHTML
      const res = diffUtil(goatNode, cowNode)
      
      expect(res).toEqual(cowNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should remove orphaned keyed nodes', () => {
      const newNode = eR(`div`, eR('div', 'I am Goat'), eR('div', { id: 1}, 'I am other goat'))
      const oldNode = eR(`div`, eR('div', 'I am Cow'), eR('div', { id: 2}, 'I am other cow'))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should handel whitespace properly', () => {
      const newNode = eR(`ul`)
      const oldNode = eR(`ul`, eR('li'), eR('li'), eR('li'))
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
    })

    it('should handel nested element with ids', () => {
      const lastChildNode = eR(`div`, { id: 'child-child' }, 'I am the last child')
      const orgChildNode = eR(`div`, { id: 'child-child' }, 'I am the org child')
      const childNode = eR(`div`, { id: 'child' }, lastChildNode)
      const placeholderNode = eR(`div`, { id: 'child' }, orgChildNode)
      placeholderNode.isSameNode = el => (el === child)
      const newNode = eR(`div`, childNode)
      const oldNode = eR(`div`, placeholderNode)
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
      expect(res.children[0].children[0]).toEqual(lastChildNode)

    })

    it('should handel nested elements without id', () => {
      const lastChildNode = eR(`div`, 'I am the last child')
      const orgChildNode = eR(`div`, 'I am the org child')
      const childNode = eR(`div`, lastChildNode)
      const placeholderNode = eR(`div`, orgChildNode)
      placeholderNode.isSameNode = el => (el === child)
      const newNode = eR(`div`, childNode)
      const oldNode = eR(`div`, placeholderNode)
      const expected = newNode.outerHTML
      const res = diffUtil(newNode, oldNode)

      expect(res).toEqual(oldNode)
      expect(res.outerHTML).toEqual(expected)
      expect(res.children[0].children[0]).toEqual(lastChildNode)
    })

  })

})



