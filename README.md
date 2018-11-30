# vue-photoswipe.js

A directive supported plugin for PhotoSwipe in Vue.js components.

## install

> npm i vue-photoswipe.js -s

Add code likes below before create `Vue` instance:

```js
import PhotoSwipe from 'vue-photoswipe.js';

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
// Use your custom pswp component
import PswpVue from 'path/to/custom/pswp.vue';

Vue.use(PhotoSwipe, { PswpVue });
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
