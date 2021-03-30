/**
 * Rollup Babel config
 *
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '89',
        },
      },
    ],
    ['@babel/preset-react'],
  ],
}
