import { clearObj, isObj } from '../../utils'

let Render

const load = (renderPath) => import(
  /* webpackInclude: /\.js$/ */
  /* webpackChunkName: "render-[request]" */
  /* webpackMode: "lazy" */
  `./${renderPath || 'js'}`
  )
  .then(_renders => {
    Render = _renders && _renders.default
    return Render
  })

const get = type => (type && Render[type] || Render)
  


const destroy = (settings) => (
  Render && Render.destory
    ? Render.destroy(settings)
    : Object.entries(Render).map(
      typeRender => typeRender.destroy && typeRender.destroy(settings)
    ) && clearObj(Render)
)

export default {
  destroy,
  get,
  load,
}