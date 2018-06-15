/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './index.js',
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [path.resolve('./node_modules'), path.resolve('./src')]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/],
				use: {
					loader: 'babel-loader',
					query: {
						presets: ['es2015']
					}
				}
			},
			{
				test: /\.less$/,
				loaders: ['style-loader', 'css-loader', 'less-loader']
			},
			{
				// Copied from https://github.com/coryhouse/react-slingshot/issues/128
				test: /\.(jpe?g|ico|gif|png|svg|woff|ttf|wav|mp3)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[path][name].[ext]'
					}
				}
			}
		]
	}
};
