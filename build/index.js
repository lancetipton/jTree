

const jsonApiCall = () => {
  return new Promise((res, rej) => {
    res(window.TEST_DOM_DATA)
  })
}


document.addEventListener('DOMContentLoaded', () => {

  const jTree = window.jTree
  let Editor
  let editorNode = document.getElementById('editor')
  let saveBtn = document.getElementById('save-btn')
  saveBtn.addEventListener('click', () => {
    Editor.destroy()
    console.log('------------------Editor------------------');
    console.log(Editor);
  })
  
  const onChange = (event, update, id, Editor) => {
    console.log('on change')
    console.log(obj)
  }

  // Calls composer.destroy() after this method CB
  const onSave = (event, update, id, Editor) => {
    console.log('on save')
    console.log(html)
  }

  // Calls composer.destroy() after this method CB
  const onCancel = (event, update, id, Editor) => {
    console.log('on cancel')
  }
  
  const matchHelper = ({ value, key, matchTypes, tree, parent, Editor }) => {
    // Only here as a test for now.... remove later
    const TypeTree = Editor.Types.get()
    return typeof value === 'object'
      ? TypeTree.children.map
      : TypeTree.children.string
  }
    
  const numOnChange = (event, update, id, Editor) => {
    // console.log('------------------ Num onChange ------------------');
  }
  

  const init = async () => {
    jsonApiCall()
      .then(testData => {
        
        return jTree.init({
          // ----------- General Settings ---------- //
          element: editorNode,
          showLogs: true,
          // Dynamically load renders from path
          // Set true to use default js renders
          renderPath: false,
          // ----------- Editor Config ---------- //
          editor: {
            // Called for all type events
            // Can override all types events
            // onChange: onChange,
            // onSave: onSave,
            // onCancel: onCancel,
            source: testData,
            // Source object to be edited
            root: {
              start: 'open',
                // Defaults to closed
              title: 'j-Tree',
                // Header title of the object
                // Defaults to Object Tree
            },
            iconType: 'far',
            styles: {},
            appendTree: () => {}
          },

          // ----------- Types Config ---------- //
          types: {
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
              matchHelper: matchHelper,
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
          //   undefined: {
          //     /* Undefined / Null - Default Type */
          //     matchHelper: matchHelper,
          //     /* Will be called when a value is undefined or null */
          //   },
          //   boolean: {},
          //     /* Boolean - Default Type */

            map: {
                /*
                  * Override the build method of the map type
                    * Allows customizing the shouldComponentUpdate method on map type
                */
            },
          //     /*  Map (Object) - Default Type */

          //   collection: {},
          //     /*  Collection (Array) - Default Type */

            string: {},
          //     /*  String - Default Type */

          //     /* ----- Extra default types that extend String type ----- */
          //     card: {},
          //     color: {},
          //     date: {},
          //     email: {},
          //     phone: {},
          //     url: {},
          //     uuid: {},

            number: {
              onChange: numOnChange,
              expandOnChange: true,
            },
          //     /* Default Type ( number ) */

          //     /* ----- Extra default types that extend Number type ----- */
          //     float: {},
          //     money: {},
          //     percent: {},

          //   /* ----- Custom Type Settings ----- */
          //   myCustomType: {
          //     /*
          //       * Custom Type Settings for custom `Type Class` defined below
          //     */
          //   }

          },

          // // ----------- Custom Types Definitions ---------- //
          // customTypes: {
          //   /*
          //     Define custom types on initialization of the jTree Editor
          //       * Key must be the same as the key in the types object above
          //       * When key matches a default `Type Class`
          //         * The custom `Type Class` **WILL** overwrite the default
          //       * Custom Type Config
          //         * Passed on the instantiation of a new `Type Class Instance`
          //         * Must be defined in the `settings.types` object above
          //   */
          //   myCustomType: MyCustomTypeClass
          // }
        
        })
      
        
      })
      .then(_editor => {
        if(!_editor) return
        Editor = _editor
        // Object.entries(Editor.tree.idMap).map(([ id, pos ]) => {
        //   const element = document.getElementById(id)
        //   if(!element) return
        //   element.addEventListener('click', e => {
        //     Editor.updateAtPos(pos, {
        //       test: 'data',
        //       food: 'bar'
        //     })
        //     e.preventDefault()
        //     e.stopPropagation()
        //   })
        // })
      })
  }

  init()

})