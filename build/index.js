

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
          types: {},
        })

      })
  }

  init()

})
