"use strict";

var _elementR = require("elementR");

var differ = require('../diff_util.js');

var diffUtil = differ.diffUpdate;
describe('Diff Util - diffUpdate', function () {
  describe('Root level node', function () {
    it('should replace a node', function () {
      var newNode = (0, _elementR.eR)('p', 'Mr. Goat 4 Pres');
      var oldNode = (0, _elementR.eR)('div', 'Mr. Goat 4 Pres');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should morph a node', function () {
      var newNode = (0, _elementR.eR)('p', 'Mr. Goat 4 Pres');
      var oldNode = (0, _elementR.eR)('p', 'Goats Breath');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should morph a node with namespaced attribute', function () {
      var newNode = (0, _elementR.eR)('svg', '<use xlink:href="#heybooboo"></use>');
      var oldNode = (0, _elementR.eR)('svg', '<use xlink:href="#boobear"></use>');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should ignore if node is same', function () {
      var newNode = (0, _elementR.eR)('p', 'Mr. Goat 4 Pres');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, newNode);
      expect(res.outerHTML).toEqual(expected);
    });
  });
  describe('Nested child nodes', function () {
    it('should replace a node', function () {
      var newNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Mr. Goat 4 Pres'));
      var oldNode = (0, _elementR.eR)('main', (0, _elementR.eR)('div', 'Mr. Goat 4 Pres'));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should replace a node', function () {
      var newNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Mr. Goat 4 Pres'));
      var oldNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Goats Breath'));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should replace a node', function () {
      var newNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Mr. Goat 4 Pres'));
      var oldNode = (0, _elementR.eR)('main', (0, _elementR.eR)('div', 'hello stuff'));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should append a node', function () {
      var newNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Goats Breath'));
      var oldNode = (0, _elementR.eR)('main', '');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should remove a node', function () {
      var newNode = (0, _elementR.eR)('main', '');
      var oldNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Goats Breath'));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should update child nodes', function () {
      var newNode = (0, _elementR.eR)('section', (0, _elementR.eR)('p', 'Goats Breath'));
      var oldNode = (0, _elementR.eR)('main', (0, _elementR.eR)('p', 'Mr. Goat 4 Pres'));
      var expected = '<main><p>Goats Breath</p></main>';
      var res = diffUtil(newNode, oldNode, {
        childrenOnly: true
      });
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
  });
  describe('Node values', function () {
    it('if new tree has no value and old tree does, remove value', function () {
      var newNode = (0, _elementR.eR)('input', {
        type: "text",
        value: "goat"
      });
      var oldNode = (0, _elementR.eR)('input', {
        type: "text"
      });
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.getAttribute('value')).toEqual('goat');
    });
    it('should set value to null when new value is null', function () {
      var newNode = (0, _elementR.eR)('input', {
        type: "text",
        value: null
      });
      var oldNode = (0, _elementR.eR)('input', {
        type: "text",
        value: "Goat"
      });
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.getAttribute('value')).toEqual(null);
    });
    it('should set value when value is defined through it property', function () {
      var newNode = (0, _elementR.eR)('input');
      newNode.value = 'Goat';
      var oldNode = (0, _elementR.eR)('input');
      oldNode.value = 'Cow';
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.value).toEqual('Goat');
    });
    it('should set value when value is defined through it poperty on the old node', function () {
      var newNode = (0, _elementR.eR)('input', {
        type: "text",
        value: null
      });
      var oldNode = (0, _elementR.eR)('input', {
        type: "text"
      });
      oldNode.value = 'Cow';
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.value).toEqual('');
    });
    it('should set value when value is defined through it poperty on the new node', function () {
      var newNode = (0, _elementR.eR)('input', 'type');
      newNode.value = 'Goat';
      var oldNode = (0, _elementR.eR)('input', {
        type: "text",
        value: 'Cow'
      });
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.value).toEqual('Goat');
    });
    it('if new tree has value and old tree does too, set value from new tree', function () {
      var newNode = (0, _elementR.eR)('input', {
        type: "text",
        value: "Goat"
      });
      var oldNode = (0, _elementR.eR)('input', {
        type: "text",
        value: "Cow"
      });
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.value).toEqual('Goat');
    });
  });
  describe('Nodes are the same', function () {
    it('should return a if true', function () {
      var newNode = (0, _elementR.eR)('div', 'Mr. Goat');
      var oldNode = (0, _elementR.eR)('div', 'Brown Cow');

      oldNode.isSameNode = function (el) {
        return true;
      };

      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.childNodes[0].data).toEqual('Mr. Goat');
    });
    it('should return newNode if not the same node', function () {
      var newNode = (0, _elementR.eR)('div', 'Mr. Goat');
      var oldNode = (0, _elementR.eR)('div', 'Brown Cow');

      oldNode.isSameNode = function (el) {
        return false;
      };

      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(newNode);
      expect(res.childNodes[0].data).toEqual('Mr. Goat');
    });
  });
  describe('Node lists', function () {
    it('should append nodes', function () {
      var newNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", 1), (0, _elementR.eR)("li", 2), (0, _elementR.eR)("li", 3), (0, _elementR.eR)("li", 4), (0, _elementR.eR)("li", 5));
      var oldNode = (0, _elementR.eR)("ul");
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should remove nodes', function () {
      var newNode = (0, _elementR.eR)("ul");
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", 1), (0, _elementR.eR)("li", 2), (0, _elementR.eR)("li", 3), (0, _elementR.eR)("li", 4), (0, _elementR.eR)("li", 5));
      var res = diffUtil(newNode, oldNode);
      var expected = newNode.outerHTML;
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
  });
  describe('Select and option nodes', function () {
    it('should append nodes', function () {
      var newNode = (0, _elementR.eR)('select', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', 2), (0, _elementR.eR)('option', 3));
      var oldNode = (0, _elementR.eR)('select');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should append nodes (including optgroups)', function () {
      var newNode = (0, _elementR.eR)('select', (0, _elementR.eR)('optgroup', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', 2), (0, _elementR.eR)('option', 3)), (0, _elementR.eR)('option', 4), (0, _elementR.eR)('option', 5));
      var oldNode = (0, _elementR.eR)('select');
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should remove nodes', function () {
      var newNode = (0, _elementR.eR)('select');
      var oldNode = (0, _elementR.eR)('select', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', 2), (0, _elementR.eR)('option', 3));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should remove nodes (including optgroups)', function () {
      var newNode = (0, _elementR.eR)('select');
      var oldNode = (0, _elementR.eR)('select', (0, _elementR.eR)('optgroup', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', 2), (0, _elementR.eR)('option', 3)), (0, _elementR.eR)('option', 4), (0, _elementR.eR)('option', 5));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should add selected', function () {
      var newNode = (0, _elementR.eR)('select', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', {
        selected: true
      }, 2), (0, _elementR.eR)('option', 3));
      var oldNode = (0, _elementR.eR)('select', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', 2), (0, _elementR.eR)('option', 3));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should switch selected', function () {
      var newNode = (0, _elementR.eR)('select', (0, _elementR.eR)('option', 1), (0, _elementR.eR)('option', {
        selected: true
      }, 2), (0, _elementR.eR)('option', 3));
      var oldNode = (0, _elementR.eR)('select', (0, _elementR.eR)('option', {
        selected: true
      }, 1), (0, _elementR.eR)('option', 2), (0, _elementR.eR)('option', 3));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
  });
  describe('General node updates', function () {
    it('should replace nodes', function () {
      var newNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", 1), (0, _elementR.eR)("li", 2), (0, _elementR.eR)("li", 3), (0, _elementR.eR)("li", 4), (0, _elementR.eR)("li", 5));
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("div", 1), (0, _elementR.eR)("li", 2), (0, _elementR.eR)("li", 3), (0, _elementR.eR)("li", 4), (0, _elementR.eR)("li", 5));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should replace nodes after multiple iterations', function () {
      var newNode = (0, _elementR.eR)("ul");
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", 1), (0, _elementR.eR)("li", 2), (0, _elementR.eR)("li", 3), (0, _elementR.eR)("li", 4), (0, _elementR.eR)("li", 5));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
      oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("div", 1), (0, _elementR.eR)("li", 2), (0, _elementR.eR)("li", 3), (0, _elementR.eR)("li", 4), (0, _elementR.eR)("li", 5));
      res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
  });
  describe('Use id as a key hint', function () {
    it('should append an element', function () {
      var newNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", {
        id: "1"
      }, 1), (0, _elementR.eR)("li", {
        id: "goat"
      }, "goat"), (0, _elementR.eR)("li", {
        id: "2"
      }, 2), (0, _elementR.eR)("li", {
        id: "3"
      }, 3));
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", {
        id: "1"
      }, 1), (0, _elementR.eR)("li", {
        id: "2"
      }, 2), (0, _elementR.eR)("li", {
        id: "3"
      }, 3));
      var newHtml = newNode.outerHTML;
      var oldFirstId = oldNode.children[0].id;
      var oldSecondId = oldNode.children[1].id;
      var oldThirdId = oldNode.children[2].id;
      var oldFirstText = oldNode.children[0].textContent;
      var oldSecondText = oldNode.children[1].textContent;
      var oldThirdText = oldNode.children[2].textContent;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(oldFirstId).toEqual(res.children[0].id);
      expect(oldSecondId).toEqual(res.children[2].id);
      expect(oldThirdId).toEqual(res.children[3].id);
      expect(oldFirstText).toEqual(res.children[0].textContent);
      expect(oldSecondText).toEqual(res.children[2].textContent);
      expect(oldThirdText).toEqual(res.children[3].textContent);
      expect(res.outerHTML).toEqual(newHtml);
    });
    it('should handle non-id elements', function () {
      var newNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", 'Mr. Goat'), (0, _elementR.eR)("li", {
        id: "1"
      }, 1), (0, _elementR.eR)("li", {
        id: "goat"
      }, "goat"), (0, _elementR.eR)("li", {
        id: "2"
      }, 2), (0, _elementR.eR)("li", {
        id: "3"
      }, 3), (0, _elementR.eR)("li", 4));
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", {
        id: "1"
      }, 1), (0, _elementR.eR)("li", {
        id: "2"
      }, 2), (0, _elementR.eR)("li", {
        id: "3"
      }, 3));
      var newHtml = newNode.outerHTML;
      var oldFirstId = oldNode.children[0].id;
      var oldSecondId = oldNode.children[1].id;
      var oldThirdId = oldNode.children[2].id;
      var oldFirstText = oldNode.children[0].textContent;
      var oldSecondText = oldNode.children[1].textContent;
      var oldThirdText = oldNode.children[2].textContent;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(oldFirstId).toEqual(res.children[1].id);
      expect(oldSecondId).toEqual(res.children[3].id);
      expect(oldThirdId).toEqual(res.children[4].id);
      expect(oldFirstText).toEqual(res.children[1].textContent);
      expect(oldSecondText).toEqual(res.children[3].textContent);
      expect(oldThirdText).toEqual(res.children[4].textContent);
      expect(res.outerHTML).toEqual(newHtml);
    });
    it('should replace children when not the same', function () {
      var newNode = (0, _elementR.eR)("section", "hello");
      var oldNode = (0, _elementR.eR)("section", (0, _elementR.eR)("div"));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should remove a child element when it dosnt exist', function () {
      var newNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", {
        id: "a"
      }), (0, _elementR.eR)("li", {
        id: "c"
      }));
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)("li", {
        id: "a"
      }), (0, _elementR.eR)("li", {
        id: "b"
      }), (0, _elementR.eR)("li", {
        id: "c"
      }));
      var oldFirstId = oldNode.children[0].id;
      var oldThirdId = oldNode.children[2].id;
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.children[0].id).toEqual(oldFirstId);
      expect(res.children[1].id).toEqual(oldThirdId);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should swap proxy elements based on id even when not the same element', function () {
      var goatNode = (0, _elementR.eR)("li", {
        id: "goat"
      });
      var cowNode = (0, _elementR.eR)("li", {
        id: "cow"
      });
      var setFirstNode = (0, _elementR.eR)("div", {
        id: "goat",
        'data-placeholder': true
      });

      setFirstNode.isSameNode = function (el) {
        return el === setFirstNode;
      };

      var setSecondNode = (0, _elementR.eR)("div", {
        id: "cow",
        'data-placeholder': true
      });

      setSecondNode.isSameNode = function (el) {
        return el === setSecondNode;
      };

      var newNode = (0, _elementR.eR)("ul", goatNode, cowNode);
      var oldNode = (0, _elementR.eR)("ul", setSecondNode, setFirstNode);
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.children[0]).toEqual(goatNode);
      expect(res.children[1]).toEqual(cowNode);
    });
    it('should still diff and update when id matchs', function () {
      var goatNode = (0, _elementR.eR)("div", {
        id: "goat"
      }, 'I am Goat');
      var cowNode = (0, _elementR.eR)("div", {
        id: "goat"
      }, 'I am Cow');
      var expected = goatNode.outerHTML;
      var res = diffUtil(goatNode, cowNode);
      expect(res).toEqual(cowNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should remove orphaned keyed nodes', function () {
      var newNode = (0, _elementR.eR)("div", (0, _elementR.eR)('div', 'I am Goat'), (0, _elementR.eR)('div', {
        id: 1
      }, 'I am other goat'));
      var oldNode = (0, _elementR.eR)("div", (0, _elementR.eR)('div', 'I am Cow'), (0, _elementR.eR)('div', {
        id: 2
      }, 'I am other cow'));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should handel whitespace properly', function () {
      var newNode = (0, _elementR.eR)("ul");
      var oldNode = (0, _elementR.eR)("ul", (0, _elementR.eR)('li'), (0, _elementR.eR)('li'), (0, _elementR.eR)('li'));
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
    });
    it('should handel nested element with ids', function () {
      var lastChildNode = (0, _elementR.eR)("div", {
        id: 'child-child'
      }, 'I am the last child');
      var orgChildNode = (0, _elementR.eR)("div", {
        id: 'child-child'
      }, 'I am the org child');
      var childNode = (0, _elementR.eR)("div", {
        id: 'child'
      }, lastChildNode);
      var placeholderNode = (0, _elementR.eR)("div", {
        id: 'child'
      }, orgChildNode);

      placeholderNode.isSameNode = function (el) {
        return el === child;
      };

      var newNode = (0, _elementR.eR)("div", childNode);
      var oldNode = (0, _elementR.eR)("div", placeholderNode);
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
      expect(res.children[0].children[0]).toEqual(lastChildNode);
    });
    it('should handel nested elements without id', function () {
      var lastChildNode = (0, _elementR.eR)("div", 'I am the last child');
      var orgChildNode = (0, _elementR.eR)("div", 'I am the org child');
      var childNode = (0, _elementR.eR)("div", lastChildNode);
      var placeholderNode = (0, _elementR.eR)("div", orgChildNode);

      placeholderNode.isSameNode = function (el) {
        return el === child;
      };

      var newNode = (0, _elementR.eR)("div", childNode);
      var oldNode = (0, _elementR.eR)("div", placeholderNode);
      var expected = newNode.outerHTML;
      var res = diffUtil(newNode, oldNode);
      expect(res).toEqual(oldNode);
      expect(res.outerHTML).toEqual(expected);
      expect(res.children[0].children[0]).toEqual(lastChildNode);
    });
  });
});