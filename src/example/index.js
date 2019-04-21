

const jsonApiCall = () => {
  return new Promise((res, rej) => {
    res(window.TEST_DOM_DATA)
  })
}


document.addEventListener('DOMContentLoaded', function(){

  const jTree = window.jTree
  
  
  const onChange = (obj) => {
    console.log('on change')
    console.log(obj)
  }

  // Calls composer.destroy() after this method CB
  const onSave = (html) => {
    console.log('on save')
    console.log(html)
  }

  // Calls composer.destroy() after this method CB
  const onCancel = () => {
    console.log('on cancel')
  }
  
  const matchHelper = (value, key, matchTypes, tree, parent, Editor) => {
    console.log('------------------value------------------');
    console.log(value);
    console.log('------------------key------------------');
    console.log(key);
    console.log('------------------matchTypes------------------');
    console.log(matchTypes);
    console.log('------------------parent------------------');
    console.log(parent);
    console.log('------------------Editor------------------');
    console.log(Editor);
  }
  
  let Editor
  let editorNode = document.getElementById('editor')
  const init = async () => {
    jsonApiCall()
      .then(testData => {
        
        Editor = jTree.init({
          element: editorNode,
          showLogs: true,
          onChange: onChange,
          onSave: onSave,
          onCancel: onCancel,
          data: testData,
          matchHelper: matchHelper,
          // Need to break settings in the types object
          // Each types will get it's own settings
          // Which will allow for things like matchHelper per type
          // and custom settings for that type
          // Update so can only create new types through the registerType method
          // No defining at initialize
          // Then settings go into the types object
          types: {

            // number ----------------
            number: {
              // Put match helper here relative to the root type
              matchHelper: matchHelper,
            },
            // All editors defined here, not as child editors, string editors example
            float: {},
            money: {},
            percent: {},

            // map ( object ) ----------------
            map: {},

            // collection ( array ) ----------------
            collection: {},

            // ----------------
            string: {
              // Set custom priority
              // When matching content to type,
              // If more then one type.eval matches,
              // The type with higher priority wins
              // If the priority is the same, the matchHelper will be called
              priority: 1
              // Put match helper here relative to the root types
              // Custom types don't get a matchHelper
              // Will use the matchHelper of the root type that the custom type is extending
              matchHelper: matchHelper,
            },
            // All editors defined here, not as child editors, string editors example
            card: {},
            color: {},
            date: {},
            email: {},
            phone: {},
            url: {},
            uuid: {},
            // ----------------
          },
          // Break priorities up into seperate sections per type
          
          // Need to add a date type
          
          // priorities: {
          //   default: 0,
          //   base: 0,
          //   map: 1,
          //   collection: 1,
          //   string: 1,
          //   card: 2,
          //   color: 2,
          //   email: 2,
          //   phone: 2,
          //   url: 2,
          //   uuid: 2,
          //   number: 1,
          //   float: 2,
          //   percent: 2,
          //   money: 2,
          // }
        })

      })
  }

  init()

})
