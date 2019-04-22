import { clearObj } from '../utils'

let Render

const register = (_Render) => {
  if(_Render) Render = _Render
}

const get = () => {
  return Render
}

const destroy = () => {
  _Render && Render.destory
    ? Render.destory()
    : clearObj(Render)
}

export default {
  destroy,
  get,
  register,
}