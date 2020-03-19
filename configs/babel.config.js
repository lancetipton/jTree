module.exports = {
  presets: [
    [ '@babel/preset-env', { targets: { node: "current" } }],
    [ '@babel/preset-react' ]
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    "@babel/plugin-transform-property-literals",
    '@babel/plugin-transform-computed-properties',
    "@babel/plugin-transform-object-assign",
  ]
}