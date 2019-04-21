class BaseType {

   constructor(settings){
    if(settings.priorities && settings.priorities.base)
      this.#priority = settings.priorities.base
   }
   
   static eval = value => typeof value == 'string'

   #priority = 0
   
   setPriority = num => {
     if(typeof num === 'number' && num > -1)
      this.#priority = num
   }

   getPriority = () => this.#priority
  
    build = (value, key, meta, tree, parent, settings) => {
      
    }
}



export default BaseType