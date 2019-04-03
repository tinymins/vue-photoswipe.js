/**
 * This file is part of vue-photoswipe.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import Vue from 'vue';
import App from './App';
import PhotoSwipePlugin from './components/photoswipe';

Vue.use(PhotoSwipePlugin);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
