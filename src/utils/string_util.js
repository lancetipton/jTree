export const parseJSONString = str => {
  try {
    return JSON.parse(str)
  }
  catch(e){
    return e.message
  }
}

export const capitalize = str => (
  typeof str === 'string' && `${str[0].toUpperCase()}${str.slice(1)}` || str
)

export const isStr = str => typeof str === 'string'