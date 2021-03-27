/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  // --- Get arguments ---
  const { p: isProduction } = argv;

  // --- Set up paths ---
  const HTML_OUTPUT_PATH = '';
  const HTML_OUTPUT_FILE = path.join(HTML_OUTPUT_PATH, 'index.html');
  const BUNDLE_OUTPUT_PATH = path.resolve('./dist');

  return {
    mode: isProduction ? 'production' : 'development',
    context: path.join(__dirname, '/src'),
    entry: ['./js/index.jsx'],
    output: {
      filename: 'js/bundle.[hash].js',
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
          test: /\.(scss|css)$/,
          use: [
            // Extract CSS when in production mode: https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { sourceMap: !isProduction } },
            { loader: 'sass-loader', options: { sourceMap: !isProduction } },
          ],
        },
        {
          // Copied from https://github.com/coryhouse/react-slingshot/issues/128
          test: /\.(jpe?g|ico|gif|png|svg|woff|ttf|wav|mp3)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
              },
            },
          ],
        },
      ],
    },
    devServer: {
      publicPath: '/',
      historyApiFallback: true,
      port: 8000, // For docker container
      // NOTE: for running in docker, ensure dev server is accessible to the ouside world: https://dev.to/azawakh/don-t-forget-to-give-host-0-0-0-0-to-the-startup-option-of-webpack-dev-server-using-docker-1483
      proxy: {
        '/api': {
          // Proxy to the docker network, rather than localhost
          // For legacy setup, you must set this manually
          target: 'http://webserver:80',
          secure: false,
        },
      },
    },
    plugins: [
      new FaviconsWebpackPlugin({
        logo: 'img/Ashkeepers_Rest_Small.png',
        prefix: 'img/',
        cache: true,
        inject: true,
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: false,
            opengraph: false,
            twitter: false,
            yandex: false,
            windows: false,
          },
        },
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: HTML_OUTPUT_FILE,
        template: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[id].[hash].css',
      }),
    ],
  };
};
