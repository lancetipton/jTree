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

## Types

### Dynamically Loaded

* Installed as a node_module
* Must follow strict path
  * Loaded module must be located at
    `node_modules/jtree-definitions/build/<name of types js file>`
  * All different types of definitions should follow this pattern
* Current libraries
  * [Javascript](https://github.com/lancetipton/jtree-definitions)

### Priority
  * In matching value to `Type Class Instance` and more then one match is found
    * The `Type Class Instance` with higher priority will be used
    * If the priority is the same
      * If the matches extend the same `Parent Type Class`
        * If `Parent Type Class` has a `matchHelper` method
          * It will be called
        * If `Parent Type Class` does not have a `matchHelper` method
          * The `Base Parent Type Class` `matchHelper` method will be called
  

### More docs coming soon