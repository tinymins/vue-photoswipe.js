/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
process.env.NODE_ACTION = 'build';
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinifyPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const SWPrecachePlugin = require('sw-precache-webpack-plugin');
const utils = require('./utils');
const loader = require('./utils/loader');
const config = require('../config');
const webpackBaseConfig = require('./webpack.base.conf');


const webpackConfig = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    photoswipe: utils.fullPath('src/components/photoswipe/index.js'),
  },
  output: {
    filename: '[name].js',
    library: 'PhotoSwipe',
    libraryTarget: 'umd',
    umdNamedDefine: true,
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
          cache: true,
          emitWarning: true,
          failOnError: false,
          formatter: eslintFriendlyFormatter,
        },
      },
      ...loader.styleLoaders(true),
    ],
  },
  devtool: false,
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: utils.fullPath(config.assetsSubDirectory),
        to: config.assetsSubDirectory,
        ignore: ['.*'],
      },
    ]),
    new SWPrecachePlugin({
      cacheId: 'haiman-vue',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: /\/(m)/,
          handler: 'networkFirst',
        },
      ],
    }),
    // Make sure that the plugin is after any plugins that add images
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
  ],
});

webpackConfig.optimization.minimizer = [
  new OptimizeCSSAssetsPlugin({
    assetNameRegExp: /\.css(\?.*)?$/,
    cssProcessorOptions: {
      safe: true,
    },
  }),
  new MinifyPlugin({
    cache: false,
    parallel: true,
  }),
];


if (config.productionGzip) {
  webpackConfig.plugins.push(new CompressionWebpackPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: new RegExp(`\\.(${config.productionGzipExtensions.join('|')})$`),
    threshold: 10240,
    minRatio: 0.8,
  }));
}

module.exports = webpackConfig;
