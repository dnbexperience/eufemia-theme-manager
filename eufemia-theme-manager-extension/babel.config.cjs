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
    ['@emotion/babel-preset-css-prop'],
  ],
  plugins: ['@emotion/babel-plugin', '@babel/plugin-proposal-class-properties'],
}
