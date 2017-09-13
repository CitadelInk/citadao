const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    query: {
                        modules: true,
                        localIdentName: '[name]__[local]__[hash:base64:5]',
                        context: './'
                    }
                }
            ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    })
  ],
  devServer: {
    port: 8080,

    // respond to 404s with index.html
    historyApiFallback: true,

    disableHostCheck: true,

    // enable HMR on the server
    hot: true
  }
}