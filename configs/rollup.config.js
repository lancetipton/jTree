import babel from 'rollup-plugin-babel'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import sourcemaps from 'rollup-plugin-sourcemaps'
import alias from '@rollup/plugin-alias'
import pathAlias from './aliases.json'
import buildHook from './buildHook'

const { DEV_MODE } = process.env
const babelConfig = require('./babel.config.js')

export default {
  external: [
    'react',
    'react-dom',
    '@fortawesome',
    'jsutils',
    'prop-types',
  ],
  watch: {
    clearScreen: false
  },
  input: `./src/index.js`,
  output: [
    {
      file: `./build/cjs/jTree.js`,
      format: 'cjs',
      sourcemaps: true
    },
    {
      file: `./build/esm/jTree.js`,
      format: 'esm',
      sourcemaps: true
    }
  ],
  plugins: [
   DEV_MODE && buildHook(DEV_MODE),
    replace({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    alias({
      entries: { ...pathAlias },
    }),
    resolve(),
    json(),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      ...babelConfig
    }),
    sourcemaps(),
    cleanup(),
  ]
}
