"use strict";

var _README = _interopRequireDefault(require("../../README.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var iconMap = {
  install: '<i class="fas fa-clipboard-check"></i>',
  dependencies: '<i class="fas fa-plug"></i>',
  features: '<i class="fab fa-font-awesome-flag"></i>',
  theme: '<i class="fas fa-palette"></i>',
  tools: '<i class="fas fa-tools"></i>',
  'custom-tools': '<i class="fas fa-hammer"></i>',
  settings: '<i class="fas fa-magic"></i>',
  styles: '<i class="fas fa-paint-brush"></i>',
  'tipdig-it-api': '<i class="fas fa-atom"></i>',
  'editor-api': '<i class="fas fa-atom"></i>',
  'full-example': '<i class="fas fa-book-open"></i>'
};
var headerFilter = ['editor-api', 'custom-tools', 'dependencies'];

var addNavItem = function addNavItem(navList, element) {
  var linkWrp = document.createElement('li');
  var link = document.createElement('a');
  var cleaned = element.innerText.toLowerCase().replace(/ /g, '-');
  if (headerFilter.indexOf(cleaned) !== -1) return;
  element.id = "tipdig-nav-".concat(cleaned);
  link.setAttribute('href', "#".concat(element.id));
  link.innerHTML = "".concat(iconMap[cleaned] || '', "\n").concat(element.innerText);
  link.className = 'tipdig-link';
  linkWrp.appendChild(link);
  linkWrp.className = 'tipdig-link-wrapper';
  navList.appendChild(linkWrp);
};

document.addEventListener('DOMContentLoaded', function () {
  var compHW = document.getElementById('markdown-content');
  var markDown = window.markdownit({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: false,
    typographer: false,
    quotes: '“”‘’',
    highlight: function highlight() {
      return '';
    }
  });
  compHW.innerHTML = markDown.render(_README.default);
  Array.from(document.getElementsByTagName('a')).map(function (link) {
    link.setAttribute('target', '_blank');
  });
  var navList = document.getElementById('nav-list');
  navList && Array.from(compHW.getElementsByTagName('h2')).map(function (element) {
    if (!element.id) addNavItem(navList, element);
  });
});