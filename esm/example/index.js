"use strict";

var jtDefs = _interopRequireWildcard(require("jtree-definitions"));

var _constants = _interopRequireDefault(require("jtree-definitions/esm/constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var updateDefSchema = _constants.default.updateDefSchema,
    updateDefValues = _constants.default.updateDefValues;
setTimeout(function () {
  var jsonApiCall = function jsonApiCall() {
    return new Promise(function (res, rej) {
      res(window.TEST_DOM_DATA);
    });
  };

  var emptyObject = false;
  var Editor;
  var editorNode = document.getElementById('editor');
  var saveBtn = document.getElementById('save');
  saveBtn.addEventListener('click', function () {
    window.alert(JSON.stringify(Editor.tree.source, null, 2));
  });
  var resetBtn = document.getElementById('reset');
  resetBtn.addEventListener('click', function () {
    Editor && Editor.destroy && Editor.destroy();
    init();
  });
  var clearBtn = document.getElementById('clear');
  clearBtn.addEventListener('click', function () {
    Editor && Editor.destroy && Editor.destroy();
    emptyObject = true;
    init();
  });
  var deleteBtn = document.getElementById('delete');
  deleteBtn.addEventListener('click', function () {
    Editor && Editor.destroy();
  });

  var matchHelper = function matchHelper(_ref) {
    var value = _ref.value,
        key = _ref.key,
        matchTypes = _ref.matchTypes,
        tree = _ref.tree,
        parent = _ref.parent,
        Editor = _ref.Editor;
    // Only here as a test for now.... remove later
    var AllTypes = Editor.Types.get();
    return _typeof(value) === 'object' ? AllTypes.map : AllTypes.string;
  };

  var numOnChange = function numOnChange(event, update, id, Editor) {// console.log('------------------ Num onChange ------------------');
  };

  var init = function init() {
    jsonApiCall().then(function (testData) {
      var useData = emptyObject && {} || testData;
      emptyObject = false;
      updateDefSchema(jtree.Constants.Schema);
      updateDefValues(jtree.Constants.Values);
      return jtree.init({
        // ----------- General Settings ---------- //
        element: editorNode,
        showLogs: true,
        // ----------- Editor Config ---------- //
        editor: {
          // Pass a custom method, or true to confirm all jtree changes
          // Defaults to showing window.confirm dialog for actions
          confirmActions: false,
          // Called for all type events
          // Can override all types events
          // onChange: onChange,
          // onSave: onSave,
          // onCancel: onCancel,
          // Can override all events with 'all' ( default )
          // instance will override the event for all instances
          // After the 
          eventOverride: 'instance',
          source: useData,
          // Source object to be edited
          root: {
            start: 'open',
            // Defaults to closed
            title: 'My Object' // Header title of the object
            // Defaults to Object Tree

          },
          iconType: 'far',
          styles: {},
          appendTree: function appendTree() {}
        },
        // ----------- Types Config ---------- //
        types: {
          definitions: jtDefs,
          config: {
            /*
              * Define how a value will be managed / displayed
            */
            base: {
              /*
                Base - Default Type
                  * All other default types extend Base Type
                  * Used when no matching type is found
                  * Is NOT used for null || undefined values
                  * Value is treated as a string
              */
              priority: 0,

              /*
                * Override default Base priority
                * Used when a new Base Type Instance is created
                * Can be overwritten the the `BaseTypeInstance.setPriority` method
              */
              matchHelper: matchHelper
              /*
                * Will be called when
                  * When more then one type is found
                    * They all have the same priority
                    * They all extend the different Parent Types
                  * If more then one type is found
                    * They all extend the same Parent Type
                    * The Parent Type does not have a matchHelper defined
              */

              /*
                * Used to determine if the type matches the value
                * Set to override the default static Type Class method
                  * Must return a Boolean
              */

            },
            "boolean": {},

            /* Boolean - Default Type */
            map: {
              /*
                * Override the build method of the map type
                  * Allows customizing the shouldComponentUpdate method on map type
              */
            },

            /*  Map (Object) - Default Type */
            collection: {},

            /*  Collection (Array) - Default Type */
            string: {},

            /*  String - Default Type */

            /* ----- Extra default types that extend String type ----- */
            card: {},
            color: {},
            date: {},
            email: {},
            phone: {},
            url: {},
            uuid: {},
            number: {
              onChange: numOnChange,
              expandOnChange: true
            },

            /* Default Type ( number ) */

            /* ----- Extra default types that extend Number type ----- */
            "float": {},
            money: {},
            percent: {}
          }
        }
      });
    }).then(function (_editor) {
      if (!_editor) return;
      Editor = _editor;
    });
  };

  init();
});