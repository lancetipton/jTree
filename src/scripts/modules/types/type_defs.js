

const load = (renderPath) => import(
  /* webpackInclude: /\.js$/ */
  /* webpackChunkName: "type-[request]" */
  /* webpackMode: "lazy" */
  `./${renderPath || 'definitions'}`
  )
  .then(type => type && type.default)


export default { load }