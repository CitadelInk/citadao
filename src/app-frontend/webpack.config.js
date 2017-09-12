const path = require('path');
const webpack = require('webpack');
var combineLoaders = require('webpack-combine-loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  plugins: [
    new ExtractTextPlugin('styles-1.css'),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.template.ejs',
      inject: 'body',
    })
  ],
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
    ],
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.css$/,
      loader: combineLoaders([
        {
          loader: 'style-loader'
        }, {
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }
      ])
    }]
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
        template: './index.html',
        hash: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}