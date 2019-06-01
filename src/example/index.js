

const jsonApiCall = () => {
  return new Promise((res, rej) => {
    res(window.TEST_DOM_DATA)
  })
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(() => {

  const jTree = window.jTree
  let emptyObject = false
  let Editor
  let editorNode = document.getElementById('editor')

  let saveBtn = document.getElementById('save')
  saveBtn.addEventListener('click', () => {
    window.alert(JSON.stringify(Editor.tree.source, null, 2))
  })

  let resetBtn = document.getElementById('reset')
  resetBtn.addEventListener('click', () => {
    Editor && Editor.destroy && Editor.destroy()
    init()
  })

  let clearBtn = document.getElementById('clear')
  clearBtn.addEventListener('click', () => {
    Editor && Editor.destroy && Editor.destroy()
    emptyObject = true
    init()
  })

  let deleteBtn = document.getElementById('delete')
  deleteBtn.addEventListener('click', () => {
    Editor && Editor.destroy()
  })

  const onChange = (event, update, id, Editor) => {
    console.log('on change')
  }

  
  const onSave = (event, update, id, Editor) => {

  }

  
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
        const useData = emptyObject && {} || testData
        emptyObject = false
        
        return jTree.init({
          // ----------- General Settings ---------- //
          element: editorNode,
          showLogs: true,
          // Dynamically load renders from path
          // Set true to use default js renders
          renderPath: false,
          // ----------- Editor Config ---------- //
          editor: {
            // Pass a custom method, or true to confirm all jTree changes
            // Defaults to showing window.confirm dialog for actions
            confirmActions: false,
            // Called for all type events
            // Can override all types events
            // onChange: onChange,
            onSave: onSave,
            // Can override all events with 'all' ( default )
            // instance will override the event for all instances
            // After the 
            eventOverride: 'instance',
            // onSave: onSave,
            // onCancel: onCancel,
            source: useData,
            // Source object to be edited
            root: {
              start: 'open',
                // Defaults to closed
              title: 'My Object',
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
      })
  }

  init()

}, 100)})
