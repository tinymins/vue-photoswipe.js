/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const PostCompilePlugin = require('webpack-post-compile-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');

const webpackConfig = {
  stats: {
    // https://webpack.js.org/configuration/stats/
    entrypoints: false,
    children: false,
  },
  optimization: {
    runtimeChunk: {
      name: 'runtime', // webpack runtime
    },
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.fullPath('src'),
      ':': utils.fullPath('static'),
    },
    modules: [
      utils.fullPath('src'),
      utils.fullPath('node_modules'),
    ],
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      ...loader.vueLoaders(),
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [utils.fullPath('src'), utils.fullPath('test'), utils.fullPath('node_modules/cube-ui')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('img/[hash:32].[ext]'),
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('media/[hash:32].[ext]'),
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('fonts/[hash:32].[ext]'),
        },
      },
    ],
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new VueLoaderPlugin(),
    new WebpackBar(),
    new PostCompilePlugin(),
    new TransformModulesPlugin(),
    new webpack.ContextReplacementPlugin(
      /moment[\\/]locale$/,
      /^\.\/(zh-cn)$/,
    ),
    new webpack.DefinePlugin({
      'process.env': (() => {
        const env = {};
        Object.keys(config.env).forEach((k) => {
          env[k] = JSON.stringify(config.env[k]);
        });
        return env;
      })(),
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   chunksSortMode: 'none',
    //   filename: 'index.html',
    //   template: './src/index.html',
    //   inject: true,
    //   favicon: utils.fullPath('src/assets/favicon.ico'),
    // }),
    new StylelintBarePlugin({
      configFile: '.stylelintrc.js',
      files: [
        'src/**/*.vue',
        'src/**/*.css',
        'src/**/*.less',
        'src/**/*.sass',
        'src/**/*.scss',
        '!**/iconfont.css',
      ],
      // fix: true,
      cache: true,
      cacheLocation: './node_modules/.cache/.stylelintcache',
      emitErrors: true,
      failOnError: true,
    }),
  ],
};

module.exports = webpackConfig;
