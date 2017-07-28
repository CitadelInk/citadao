const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    'app': [
      'babel-polyfill',
      'react-hot-loader/patch',
      './app/index'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),

    // necessary for HMR to know where to load the hot update chunks
    publicPath: '/static/'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  devServer: {
    port: 8080,

    // respond to 404s with index.html
    historyApiFallback: true,

    disableHostCheck: true,

    // enable HMR on the server
    hot: true
  }
}