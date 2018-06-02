const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'development',
	output: {
		filename: '[name].bundle.js',
		path: path.resolve('./js'),
		publicPath: '/'
	},
	devtool: 'inline-source-map',
	devServer: {
		publicPath: '/',
		historyApiFallback: true,
		inline: true
	},
	performance: {
		hints: false
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: path.resolve('./js/index.html'),
			favicon: path.resolve('./assets/images/favicon.ico'),
			template: path.resolve('./index.html')
		})
	]
});
