/**
 * This file is part of the Haiman.
 * @link     : https://haiman.io/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 Hangzhou Haila Network Technology Co., Ltd.
 */
/* eslint no-param-reassign: "off" */

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default';
import PswpVueDefault from './index.vue';

const getEl = (node) => {
  if (!node || node === 'body') {
    node = document.createElement('div');
    document.body.appendChild(node);
  }
  return node instanceof window.Node ? node : document.querySelector(node);
};

const getImageThumb = (item, el) => {
  if (item.src) {
    return item.src;
  }
  if (el instanceof HTMLImageElement) {
    return el.src;
  }
  if (el instanceof HTMLDivElement) {
    const style = getComputedStyle(el);
    if (style && style.backgroundImage) {
      return style.backgroundImage.replace(/^url\(['"]/, '').replace(/['"]\)$/, '');
    }
  }
  if (item.origin) {
    return item.origin;
  }
  return '';
};

const getImageOrigin = (item, el) => {
  if (item.origin) {
    return item.origin;
  }
  return getImageThumb(item, el);
};

const getThumbBounds = (item, el) => {
  if (item.getThumbBoundsFn) {
    return item.getThumbBoundsFn(item, el);
  }
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top + scrollTop,
    w: rect.width,
  };
};

const install = (Vue, { PswpVue = PswpVueDefault, mountEl, wechat, pswpOptions } = {}) => {
  let directiveIndex = 0;
  const itemMap = new Map();
  const Pswp = Vue.extend(PswpVue);
  const vm = new Pswp({
    propsData: {
      PhotoSwipe,
      initOptions: pswpOptions,
      openPswp: (items, options) => new Promise((resolve) => {
        vm.photoswipe = new PhotoSwipe(vm.$el, PhotoSwipeUI, items, options);
        // Auto fix wrong image size after loaded
        vm.photoswipe.listen('gettingData', (_, item) => {
          const img = new Image();
          // get real size after image loaded
          img.onload = () => {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (item.w !== w || item.h !== h) {
              // fix wrong size
              item.w = w;
              item.h = h;
              // reinit items
              vm.photoswipe.invalidateCurrItems();
              vm.photoswipe.updateSize(true);
            }
          };
          img.src = item.src; // start loading image
        });
        vm.photoswipe.listen('close', resolve);
        vm.photoswipe.init();
      }),
      closePswp: () => {
        if (!vm.photoswipe) {
          return;
        }
        vm.photoswipe.close();
        vm.photoswipe.destroy();
      },
    },
  }).$mount(getEl(mountEl));
  const photoswipe = {
    open: vm.open,
    close: vm.close,
    config: vm.config,
  };
  Vue.photoswipe = photoswipe;
  Vue.prototype.$photoswipe = photoswipe;

  const onClick = ({ target }) => {
    const item = itemMap.get(target);
    if (!item) {
      return;
    }
    // get display items
    const items = item.group
      ? [...itemMap.entries()].filter(({ 1: p }) => p.group === item.group)
      : [[target, item]];
    // use wechat preview if possible
    if (wechat) {
      const ua = navigator.userAgent.toLowerCase();
      if (/micromessenger/.test(ua) && !/windowswechat/.test(ua)) {
        wechat.previewImage({
          urls: items.map(([k, p]) => getImageOrigin(p, k)),
          current: getImageOrigin(item, target),
        });
        return;
      }
    }
    // prepare data and open PhotoSwipe
    const images = items.map(([el, p]) => ({
      msrc: getImageThumb(p, el),
      src: getImageOrigin(p, el),
      w: p.w || el.naturalWidth || 0,
      h: p.h || el.naturalHeight || 0,
    }));
    const options = {
      history: false,
      index: items.findIndex(({ 1: p }) => p === item) || 0,
      getThumbBoundsFn: (index) => {
        const [el, p] = items[index];
        return getThumbBounds(p, el);
      },
    };
    photoswipe.open(images, options);
  };

  const update = (el, { arg, value }) => {
    let item = itemMap.get(el);
    // first time update, init el
    if (!item) {
      directiveIndex += 1;
      item = { directiveIndex };
      itemMap.set(el, item);
      el.addEventListener('click', onClick);
    }
    // update props
    if (typeof value === 'string') {
      item.group = value;
    } else if (typeof value === 'object' && value !== null) {
      item.group = value.group;
      item.index = value.index;
      item.origin = value.origin;
      item.gallery = value.gallery;
    }
    if (arg && typeof arg === 'string') {
      item.group = arg;
    }
  };

  const remove = (el) => {
    if (!itemMap.has(el)) {
      return;
    }
    itemMap.delete(el);
    el.removeEventListener('click', onClick);
  };

  // Register global directive
  const directive = {
    inserted: (el, binding) => update(el, binding),
    update: (el, binding) => update(el, binding),
    unbind: el => remove(el),
  };
  Vue.directive('photoswipe', directive);
};

export default { install };
