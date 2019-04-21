class BaseType {

   constructor(){
     
   }
   
   #priority = 0
   
   setPriority = num => {
     if(typeof num === 'number' && num > -1)
      this.#priority = num
   }

   getPriority = () => this.#priority

   eval = () => {
     
   }
}



export default BaseType