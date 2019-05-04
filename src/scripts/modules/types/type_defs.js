import { logData } from 'jTUtils'

const load = (renderPath) => import(
  /* webpackInclude: /\.js$/ */
  /* webpackChunkName: "type-[request]" */
  /* webpackMode: "lazy" */
  `./${renderPath || 'definitions'}`
  )
  .then(type => {
    if(!type || !type.default)
      logData('Could not load types, please ensure they are properly installed!')

      return type && type.default || {}
  })


export default { load }