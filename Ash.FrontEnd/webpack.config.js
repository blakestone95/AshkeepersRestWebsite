/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  // --- Get arguments ---
  const { p: isProduction } = argv;

  // --- Set up paths ---
  const HTML_OUTPUT_PATH = path.resolve(
    isProduction ? '../Ash.Backend/resources/views' : './build'
  );
  const HTML_OUTPUT_FILE = path.join(
    HTML_OUTPUT_PATH,
    isProduction ? 'index.blade.php' : 'index.html'
  );
  const BUNDLE_OUTPUT_PATH = path.resolve(
    isProduction ? '../Ash.Backend/public/js' : './build'
  );

  return {
    mode: isProduction ? 'production' : 'development',
    context: path.join(__dirname, '/src'),
    entry: ['@babel/polyfill', './js/index.jsx'],
    output: {
      filename: '[name].bundle.js',
      path: BUNDLE_OUTPUT_PATH,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [
        path.resolve('./node_modules'),
        path.resolve('./src'),
        path.resolve('./src/js'),
      ],
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
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
          loaders: [
            'style-loader',
            { loader: 'css-loader', options: { sourceMap: !isProduction } },
            { loader: 'less-loader', options: { sourceMap: !isProduction } },
          ],
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
    devServer: {
      publicPath: '/',
      historyApiFallback: true,
      inline: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          secure: false,
        },
      },
    },
    plugins: [
      new CleanWebpackPlugin([HTML_OUTPUT_PATH, BUNDLE_OUTPUT_PATH], {
        root: path.resolve('../'), // root options prevent plugin from skipping backend build dirs
      }),
      new HtmlWebpackPlugin({
        filename: HTML_OUTPUT_FILE,
        favicon: path.resolve('./src/img/favicon.ico'),
        template: path.resolve('./index.html'),
      }),
      new UglifyJSPlugin({
        sourceMap: true,
      }),
    ],
  };
};
