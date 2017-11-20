const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
      filename: 'bot.js',
      path: path.resolve(__dirname, './public')
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
                          require.resolve('babel-plugin-transform-object-rest-spread'),
                          require.resolve('babel-plugin-transform-class-properties')
                      ]
                  }
              }
          ]
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {}  
            }
          ]
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: './bots/botAvatars', to:"bots/botAvatars" }
      ])
    ]
  }
  