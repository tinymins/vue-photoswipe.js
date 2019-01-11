# vue-photoswipe.js

A directive supported plugin for PhotoSwipe in Vue.js components.

## install

> npm i vue-photoswipe.js -s

Import photoswipe component and css before create `Vue` instance:

```js
import PhotoSwipe from 'vue-photoswipe.js';
import 'vue-photoswipe.js/dist/static/css/photoswipe.css';

Vue.use(PhotoSwipe);

// ...
new Vue({
  render: h => h(App),
}).$mount('#app');
```

You can pass options when use `PhotoSwipe`, here's some example:

```js
// Use wechat preview instead if possible
import wechat from 'path/to/wechat';

Vue.use(PhotoSwipe, { wechat });
```

```js
// Do not show share button
Vue.use(PhotoSwipe, { pswpOptions: { showShare: false } });

// Do not show close button
Vue.use(PhotoSwipe, { pswpOptions: { showClose: false } });

// Do not show share button
Vue.use(PhotoSwipe, { pswpOptions: { showShare: false } });

// Do not show fullscreen button
Vue.use(PhotoSwipe, { pswpOptions: { showFullscreen: false } });

// Do not show zoom button
Vue.use(PhotoSwipe, { pswpOptions: { showZoom: false } });

// Do not show arrow button
Vue.use(PhotoSwipe, { pswpOptions: { showArrow: false } });
```

```js
// Mount pswp in some specific element instead of 'body'
Vue.use(PhotoSwipe, { mountEl: '#mount_div' });
```

```js
// Mount pswp in some specific element instead of 'body'
const el = document.getElementById('mount_div');
Vue.use(PhotoSwipe, { mountEl: el });
```

## usage

You can simply add a directive tag to `img` or `div` to start using. Please notice that you may need to add `@click.stop` on target element if you want to stop click event.

```html
<img v-photoswipe src="some/img/path.png">
```

If you have some images as a gallery, and you want to collect them together, you can add argument on directive.

```html
<img v-photoswipe:group1 src="some/img/path1.png">
<img v-photoswipe:group1 src="some/img/path2.png">
<img v-photoswipe:group1 src="some/img/path3.png">
<img v-photoswipe:group2 src="some/img/path4.png">
<img v-photoswipe:group2 src="some/img/path5.png">
<img v-photoswipe="{ group: 'group3' }" src="some/img/path6.png">
<img v-photoswipe="{ group: 'group3' }" src="some/img/path7.png">
<img v-photoswipe="{ group: 'group3' }" src="some/img/path8.png">
```

If the `src` of img (or `background-image` of div) is a thumbnail, you may want to set it's original image url.

```html
<img v-photoswipe="{ origin: 'some/img/origin.png' }" src="some/img/thumb.png">
```

Also, you can manually call function to open or close a dynamic `PhotoSwipe` instance.

```js
// ...
mounted() {
  const items = [
    { src: 'https://website.com/image-1.png' },
    { src: 'https://website.com/image-2.png', w: 100, h: 100 },
  ];
  this.$photoswipe.open(items, options);
},
destroy() {
  this.$photoswipe.close();
},
// ...
```

```js
import Vue from 'vue';

vue.photoswipe.open(items, options);
```

For more infomation about `items` and `options`, see [PhotoSwipe official document](http://photoswipe.com/documentation/options.html).

## advanced

If you want to custom your `pwsp` element, you can pass your own `PswpVue` component when init.

First, you need to create your custom component. You must implement those methods: config, open, and close. Here's a sample:

```vue
<template>
  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" @mousewheel.prevent @touchmove.prevent @click.stop>
    <!-- Background of PhotoSwipe.  -->
    <!-- It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>
    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">
      <!-- Container that holds slides. -->
      <!-- PhotoSwipe keeps only 3 of them in the DOM to save memory. -->
      <!-- Don't modify these 3 pswp__item elements, data is added later on. -->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>
      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
          <!--  Controls are self-explanatory. Order can be changed. -->
          <div class="pswp__counter"></div>
          <button v-show="options.showClose" class="pswp__button pswp__button--close" title="Close (Esc)"></button>
          <button v-show="options.showShare" class="pswp__button pswp__button--share" title="Share"></button>
          <button v-show="options.showFullscreen" class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
          <button v-show="options.showZoom" class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
          <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>
        <button v-show="options.showArrow" class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
        <button v-show="options.showArrow" class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const pswpOptionsDefault = {
  showClose: true,
  showShare: true,
  showZoom: true,
  showArrow: true,
  showFullscreen: true,
};

export default {
  props: {
    PhotoSwipe: {
      type: Function,
      required: true,
    },
    initOptions: {
      type: Object,
      required: true,
    },
    openPswp: {
      type: Function,
      required: true,
    },
    closePswp: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      options: Object.assign({}, pswpOptionsDefault, this.initOptions),
    };
  },
  mounted() {
    window.addEventListener('popstate', this.close);
    window.addEventListener('hashchange', this.close);
  },
  destroyed() {
    window.removeEventListener('popstate', this.close);
    window.removeEventListener('hashchange', this.close);
  },
  methods: {
    config(options) {
      if (!options) {
        return;
      }
      Object.entries(options).forEach(([k, v]) => {
        this.options[k] = v;
      });
    },
    open(items, options) {
      return this.openPswp(items, options);
    },
    close() {
      return this.closePswp();
    },
  },
};
</script>

<style>
@import "~photoswipe/dist/photoswipe.css";
@import "~photoswipe/dist/default-skin/default-skin.css";
</style>
```

Then, pass then component above to PhotoSwipe when init.

```js
// Use your custom pswp component
import PswpVue from 'path/to/custom/pswp.vue';

Vue.use(PhotoSwipe, { PswpVue });
```

Notice: If you choose to use your own `pswp` component, css import from this package may not be necessary anymore.
