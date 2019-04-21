import {
  buildSubTypes,
  clearObj,
  isObj,
  logData,
  parseJSONString,
  isConstructor,
  validateBuildTypes,
  validateNewType,
} from '../utils'


const loopDataObj = (data, Editor) => {
  const matchTypes = Editor.Types.getTypes(data)
  // console.log('------------------dataType------------------');
  // console.log(matchTypes);


}

export const buildTypes = (data, Editor) => {
  if(!validateBuildTypes(data, Editor)) return null

  return loopDataObj(data, Editor)

}