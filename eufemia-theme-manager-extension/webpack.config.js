// import dotenv from 'dotenv'
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dotenv = require('dotenv')
dotenv.config()

const browser = process.env.RUNTIME_BROWSER

if (typeof process !== 'undefined') {
  process.env.NODE_ENV = 'production'
}

module.exports = {
  optimization: {
    minimize: false,
  },
  entry: {
    main: './src/app/index.js',
    content: './src/extension/content.js',
    background: './src/extension/background.js',
    'hot-reload': './src/extension/hot-reload.js',
  },
  output: {
    filename: '[name].js',
    path: __dirname + `/dist-${browser}`,
  },
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //     },
      //   ],
      //   resolve: {
      //     fullySpecified: false, // Because of @dnb/eufemia is type of module
      //   },
      // },
      {
        test: /\.(js|jsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx', // Remove this if you're not using JSX
          target: 'es2016', // Syntax to compile to (see options below for possible values)
        },
        resolve: {
          fullySpecified: false, // Because of @dnb/eufemia is type of module
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          // { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        loader: 'file-loader',
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000,
    // compress: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(makeEnvObj(process.env)),
    }),
  ],
}

function makeEnvObj(env) {
  return Object.entries(env).reduce((acc, [key, val]) => {
    if (key.startsWith('RUNTIME_')) {
      acc[key] = val
    }
    return acc
  }, {})
}
