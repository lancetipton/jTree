# jtree ( JS / JSON Object Editor )

jtree is a UI for manipulating javascript and JSON objects. See example [here](https://lancetipton.github.io/jtree/)

## Install

  * Download the repo
    ```js
      // Clone repo
      git clone https://github.com/lancetipton/jtree.git
      // Or Add to package.json
      "dependencies": {
        "jtree": "git+https://github.com/lancetipton/jtree.git"
        ...
      },
    ```
  * Add to your code
    ```js
      // * Import into code
        import jtree from 'jtree'

      // * Require code
        const jtree = require('jtree')
      
      // * Add as html script
        <script src='/path/to/jtree/build/jtree.min.js'></script>
        // elementR will be available on the window 
        <script>
          const jtree = window.jtree
        </script>
    ```
## Initialize

* Once imported into the project, call `jtree.init(<options object>)`
* This will build the tree editor
  * The tree editor will be appended to the element given from the `<options object>`
  * `<options object>` is **Required**


## Options Object



## Types

### Setup

* Installed as a separate dependency
* Current libraries
  * [Javascript](https://github.com/lancetipton/jt-js-defs)
    ```js
      // Clone repo
      git clone https://github.com/lancetipton/jt-js-defs.git
      // Or Add to package.json
      "dependencies": {
        "jt-js-defs": "git+https://github.com/lancetipton/jt-js-defs.git"
        ...
      },
    ```
* After installed, import into your project 
    ```js
      // * Import into code
        import * as jtDefs from 'jt-js-defs'

      // * Require code
        const jtDefs = require('jt-js-defs')

      // Pass into jTree when initializin
        jtree.init({
          ...
          types: {
            definitions: jtDefs,
            ...
          },
          ...
        })
        
    ```

### Priority
  * In matching value to `Type Class Instance` and more then one match is found
    * The `Type Class Instance` with higher priority will be used
    * If the priority is the same
      * If the matches extend the same `Parent Type Class`
        * If `Parent Type Class` has a `matchHelper` method
          * It will be called
        * If `Parent Type Class` does not have a `matchHelper` method
          * The `Base Parent Type Class` `matchHelper` method will be called
  

