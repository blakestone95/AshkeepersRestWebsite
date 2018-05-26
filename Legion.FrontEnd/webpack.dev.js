const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    // contentBase: path.resolve('./dist'), // Only needed if we want to serve static files
    publicPath: '/',
    historyApiFallback: true,
    inline: true
  },
  performance: {
    hints: false
  }
});
