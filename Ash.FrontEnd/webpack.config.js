/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  // --- Get arguments ---
  const { p: isProduction } = argv;

  // --- Set up paths ---
  const HTML_OUTPUT_PATH = isProduction
    ? path.resolve('../Ash.Backend/resources/views')
    : '';
  const HTML_OUTPUT_FILE = path.join(
    HTML_OUTPUT_PATH,
    isProduction ? 'index.blade.php' : 'index.html'
  );
  const BUNDLE_OUTPUT_PATH = path.resolve(
    isProduction ? '../Ash.Backend/public' : './build'
  );

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
          test: /\.(less|css)$/,
          loaders: [
            // Extract CSS when in production mode: https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
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
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          secure: false,
        },
      },
    },
    plugins: [
      new WebappWebpackPlugin({
        logo: 'img/Ashkeepers_Rest_Small.png',
        cache: true,
        prefix: 'img',
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
      new CleanWebpackPlugin({
        // Following settings are required to clean html webpack plugin output
        dangerouslyAllowCleanPatternsOutsideProject: true,
        dry: false,
        cleanOnceBeforeBuildPatterns: [
          'js/**/*',
          'img/**/*',
          'css/**/*',
          HTML_OUTPUT_FILE,
        ],
      }),
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
