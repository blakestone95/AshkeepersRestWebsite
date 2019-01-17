/* eslint-disable */
const merge = require('webpack-merge');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve('../Ash.Backend/public/js'),
		publicPath: '/js/'
	},
	devtool: 'source-map',
	plugins: [
		new CleanWebpackPlugin(
			[
				path.resolve('../Ash.Backend/public/js'),
				path.resolve('../Ash.Backend/resources/views')
			],
			{
				root: path.resolve('../')
			}
		),
		new HtmlWebpackPlugin({
			filename: path.resolve(
				'../Ash.Backend/resources/views/index.blade.php'
			),
			favicon: path.resolve('./assets/images/favicon.ico'),
			template: path.resolve('./index.html')
		}),
		new UglifyJSPlugin({
			sourceMap: true
		})
	]
});
