/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
process.env.NODE_ACTION = 'run';
const merge = require('webpack-merge');
const webpack = require('webpack');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const utils = require('./utils');
const loader = require('./utils/loader');
const webpackBaseConfig = require('./webpack.base.conf');
const config = require('../config');

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  entry: {
    app: './src/index.js',
  },
  output: {
    path: config.assetsRoot,
    publicPath: config.assetsPublicPath,
    filename: utils.assetsPath('js/[name].[hash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [utils.fullPath('src'), utils.fullPath('test')],
        options: {
          configFile: '.eslintrc.js',
          // fix: true,
          // cache: true,
          emitWarning: true,
          failOnError: false,
          formatter: eslintFriendlyFormatter,
        },
      },
      ...loader.styleLoaders(true),
    ],
  },
  // cheap-module-eval-source-map is faster for localhost dev
  devtool: '#source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash].css',
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: utils.fullPath('./src/index.html'),
      favicon: utils.fullPath('./src/assets/favicon.png'),
    }),
  ],
});

// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach((name) => {
  webpackConfig.entry[name] = [
    'eventsource-polyfill',
    './build/utils/webpack-hot-middleware-client',
  ].concat(webpackConfig.entry[name]);
});

module.exports = webpackConfig;
