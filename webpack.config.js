const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const libraryName = 'jTree'
const ENV_MODE = process.env.ENV
const outputFile = '.min.js'
const paths = [ './build' ]

module.exports = {
  mode: ENV_MODE || 'development',
  devtool: 'inline-source-map',
  entry: {
    [libraryName]: './src/scripts/index.js',
    markdown: './src/example/markdown.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name]' + outputFile,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "(typeof self !== 'undefined' ? self : this)"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.md$/,
        use: {
          loader: 'raw-loader',
        }
      },
      // { enforce: 'pre', test: /\.(js|css)$/, loader: 'remove-comments-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(paths, {}),
    new CopyWebpackPlugin([
      { from: './src/example/index.html' },
      { from: './src/example/index.css' },
      { from: './src/example/index.js' },
      { from: './src/example/test_data.js' },
      { from: './src/example/github.css' },
    ])
  ],
}
