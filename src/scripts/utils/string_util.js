export const parseJSONString = str => {
  try {
    return JSON.parse(str)
  }
  catch(e){
    return e.message
  }
}
