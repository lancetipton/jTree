const ROOT_DIR = require('app-root-path').path

/**
 * Asset types that should be stubbed out when tests run
 */
const assetStubs = [
  'jpg',
  'jpeg',
  'gif',
  'png',
  'mp4',
  'mkv',
  'avi',
  'webm',
  'swf',
  'wav',
  'mid'
].join('|')

/**
 * Modules that should be transpiled before the tests are run
 */
const transpileForTests = [
  'react-native',
].join('|')

module.exports = {
  rootDir: '../',
  preset: "rollup-jest",
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    [`^.+\\.(${assetStubs})$`]: 'jest-static-stubs/$1'
  },
  verbose: true,
  testPathIgnorePatterns: [ '/node_modules/' ],
  transform: {
    ".+\\.js$": "babel-jest"
  },
  testMatch: [
    `${ROOT_DIR}/src/**/__tests__/**/*.js?(x)`
  ],
  collectCoverageFrom: [
    `${ROOT_DIR}/src/index.js`
  ],
  moduleFileExtensions: [
    `${platform}.js`,
    "js",
    "json",
    "jsx",
    "es6"
  ],
  globals: {
    __DEV__: true
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [ `${ROOT_DIR}/configs/setupTests.js` ]
}
