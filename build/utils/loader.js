/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint-disable id-match */
/* eslint-disable no-console */

const isProd = process.env.NODE_ENV === 'production';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('./index.js');

// Generate loaders for standalone style files (outside of .vue)
const styleLoaders = (extract) => {
  const map = {
    scss: 'sass-loader',
  };
  const rules = [];
  for (let extension of ['css', 'scss']) {
    const rule = {
      test: new RegExp('\\.' + extension + '$'),
      use: []
    };
    if (map[extension]) {
      rule.use.push(map[extension]);
    }
    const devLoader = extract ? MiniCssExtractPlugin.loader : 'vue-style-loader';
    rule.use.unshift(devLoader, 'css-loader', 'postcss-loader');
    rules.push(rule);
  }
  return rules;
};

const vueLoaders = () => [{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: { // https://github.com/vuejs/vue-loader/blob/62a9155d00212f17e24c1ae05445c156b31e2fbd/docs/options.md
    compilerOptions: {
      // preserveWhitespace: false, // do not enable, will cause some bug when render list
    },
    transformAssetUrls: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href',
    },
  },
}];

exports.styleLoaders = styleLoaders;
exports.vueLoaders = vueLoaders;
