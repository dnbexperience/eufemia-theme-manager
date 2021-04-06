const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const dotenv = require('dotenv')
// import dotenv from 'dotenv'
dotenv.config()

const browser = process.env.RUNTIME_BROWSER

if (typeof process !== 'undefined') {
  process.env.NODE_ENV = 'production'
}

module.exports = {
  optimization: {
    minimize: false,
    // runtimeChunk: 'single',// generated runtime.*.js – does not work inside Figma
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  performance: {
    hints: false,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3000,
    compress: false,
  },
  entry: {
    main: './src/app/root.jsx',
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
      {
        test: /\.(js|jsx)$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx', // Remove this if you're not using JSX
          target: 'es2020', // Syntax to compile to (see options below for possible values)
        },
        resolve: {
          extensions: ['.js', '.jsx'],
          fullySpecified: false, // Because of @dnb/eufemia is type of module
        },
      },
      {
        test: /\.(css|scss)$/,
        use: [
          process.env.NODE_ENV === 'development'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        loader: 'url-loader',
      },
    ],
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
    if (/^(RUNTIME_|NODE_ENV)/.test(key)) {
      acc[key] = val
    }
    return acc
  }, {})
}
