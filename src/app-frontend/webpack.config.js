const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');


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
    path: path.resolve(__dirname, './public'),

    // necessary for HMR to know where to load the hot update chunks
    publicPath: ''
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: [
            {
                loader: require.resolve('babel-loader'),
                query: {
                    presets: [
                        require.resolve('babel-preset-es2015'),
                        require.resolve('babel-preset-react')
                    ],
                    plugins: [
                        require.resolve('babel-plugin-transform-object-rest-spread')
                    ]
                }
            }
        ]
      }
    ]
  },
  devServer: {
    port: 8080,

    // respond to 404s with index.html
    historyApiFallback: true,

    disableHostCheck: true,

    // enable HMR on the server
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: './index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}