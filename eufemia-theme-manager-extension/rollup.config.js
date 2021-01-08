import nodeResolve from '@rollup/plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
// import { terser } from 'rollup-plugin-terser'
// import dotenv from 'dotenv'
// dotenv.config()

const browser = process.env.REACT_APP_BROWSER
console.log('browser', browser)
// const production = !process.env.ROLLUP_WATCH

if (typeof process !== 'undefined') {
  process.env.NODE_ENV = 'production'
}

const babelOptions = {
  exclude: /node_modules/,
  runtimeHelpers: true, // using @babel/plugin-transform-runtime
  configFile: './babel.config.cjs',
}

const basisConfig = {
  plugins: [
    nodeResolve(),
    babel(babelOptions),
    commonjs(),
    nodeGlobals(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    replace({ 'process.env.REACT_APP_BROWSER': JSON.stringify(browser) }),
    // production &&
    // terser(), // minify, but only in production
  ],
}

const rollupConfig = [
  {
    input: './src/extension/content.js',
    output: {
      file: `dist-${browser}/content.js`,
      sourcemap: false,
    },
    ...basisConfig,
  },
  {
    input: './src/extension/background.js',
    output: {
      file: `dist-${browser}/background.js`,
      sourcemap: false,
    },
    ...basisConfig,
  },
  {
    input: './src/extension/hot-reload.js',
    output: {
      file: `dist-${browser}/hot-reload.js`,
    },
    ...basisConfig,
  },
]

export default rollupConfig
