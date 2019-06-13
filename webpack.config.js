const path = require('path')
const CleanWebpackPlugin = require('../jtree-definitions/node_modules/clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const libraryName = 'jtree'
const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV === 'development'
const buildPath = 'build'
const outputFile = '.js'
const outputPath = path.resolve(__dirname, buildPath)
const paths = [ buildPath ]
  
const wpConfig = {
  mode: NODE_ENV || 'development',
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: {
    [libraryName]: './src/index.js',
    markdown: './src/example/markdown.js',
    example: './src/example/index.js',
  },
  output: {
    path: outputPath,
    filename: `[name]${outputFile}`,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "(typeof self !== 'undefined' ? self : this)",
    chunkFilename: '[name].js',
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
      { 
        enforce: 'post',
        test: /\.(js|css)$/,
        loader: 'remove-comments-loader'
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(paths, {}),
    new CopyWebpackPlugin([
      { from: './src/example/index.html' },
      { from: './src/example/index.css' },
      { from: './src/example/test_data.js' },
      { from: './src/example/github.css' },
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ],
  watchOptions: {
    aggregateTimeout: 1000,
  },
  optimization: {
    nodeEnv: NODE_ENV,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
          sourceMap: isDev,
        }
      })
    ]
  }
}

module.exports = wpConfig