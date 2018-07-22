/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './index.js'],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
  },
  module: {
    rules: [
      {
				enforce: 'pre',
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        // Copied from https://github.com/coryhouse/react-slingshot/issues/128
        test: /\.(jpe?g|ico|gif|png|svg|woff|ttf|wav|mp3)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      },
    ],
  },
};
