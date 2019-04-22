# jTree ( JS / JSON Object Editor )

## Install


## Type Priority
  **Use Case**
    * In matching value to `Type Class Instance` and more then one match is found
      * The `Type Class Instance` with higher priority will be used
      * If the priority is the same
        * If the matches extend the same `Parent Type Class`
          * If `Parent Type Class` has a `matchHelper` method
            * It will be called
          * If `Parent Type Class` does not have a `matchHelper` method
            * The `Base Parent Type Class` `matchHelper` method will be called
  **Definition**
    * Private variable of a `Type Class Instance`
    * Can be set using method `TypeClassInstance.setPriority`
      ```js
        const myStrType = new StringType()
        myStrType.setPriority(5)
      ```
      * Can be set when creating a new instance of a `Type Class` 
        * When creating a new instance, pass an object constructor with the updated priority
          ```js
            const myStrType = new StringType({
              priority: <Number>
            })
          ```
    * Can be accessed using method `TypeClassInstance.getPriority`
      ```js
        const myStrType = new StringType()
        const strPriority = myStrType.getPriority()
      ```
    * Sets priority for **ONLY** the `Instance`, not the `Type Class`
    * If no priority set, uses the default `private static priority` for the `Type Class`
