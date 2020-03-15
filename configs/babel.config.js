

module.exports = {
  presets: [ '@babel/env', '@babel/preset-react' ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-property-literals",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-syntax-dynamic-import",
    "babel-plugin-import-css-to-jss",
    [ '@babel/plugin-proposal-class-properties' ],
  ]
}


// module.exports = {
//   presets: [
//     [
//       "@babel/preset-env"
//     ]
//   ],
//   plugins: [
//     ["transform-runtime", {
//       polyfill: false,
//       regenerator: true
//     }],
//     "@babel/plugin-transform-property-literals",
//     "@babel/plugin-proposal-object-rest-spread",
//     "@babel/plugin-transform-object-assign",
//     "@babel/plugin-syntax-dynamic-import",
//     "babel-plugin-import-css-to-jss",
//     [ "@babel/plugin-proposal-class-properties" ]
//   ],
//   env: {
//     cjs: {
//       presets: [
//         [
//           "@babel/env",
//           {
//             targets: { node: 6 },
//             useBuiltIns: false
//             corejs: 3
//           }
//         ]
//       ]
//     },
//     esm: {
//       presets: [
//         [
//           "@babel/env",
//           {
//             targets: { node: 6 },
//             useBuiltIns: "usage",
//             corejs: 3
//           }
//         ]
//       ]
//     }
//   }
// }