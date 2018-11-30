/**
 * This file is part of the Haiman.
 * @link     : https://haiman.io/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 Hangzhou Haila Network Technology Co., Ltd.
 */
/* eslint no-param-reassign: "off" */

import PswpVueDefault from './index.vue';

const getEl = (node) => {
  if (!node || node === 'body') {
    node = document.createElement('div');
    document.body.appendChild(node);
  }
  return node instanceof window.Node ? node : document.querySelector(node);
};

const getImageThumb = (option, el) => {
  if (option.src) {
    return option.src;
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
  if (option.origin) {
    return option.origin;
  }
  return '';
};

const getImageOrigin = (option, el) => {
  if (option.origin) {
    return option.origin;
  }
  return getImageThumb(option, el);
};

const install = (Vue, { PswpVue = PswpVueDefault, mountEl, wechat, pswpOptions } = {}) => {
  let directiveIndex = 0;
  const optionMap = new Map();
  const vm = new (Vue.extend(PswpVue))().$mount(getEl(mountEl));
  const photoswipe = {
    open: vm.open,
    close: vm.close,
    config: vm.config,
  };
  photoswipe.config(pswpOptions);
  Vue.photoswipe = photoswipe;
  Vue.prototype.$photoswipe = photoswipe;

  const onClick = ({ target }) => {
    const option = optionMap.get(target);
    if (!option) {
      return;
    }
    // get display options
    const options = option.group
      ? [...optionMap.entries()].filter(({ 1: p }) => p.group === option.group)
      : [[target, option]];
    // use wechat preview if possible
    if (wechat) {
      const ua = navigator.userAgent.toLowerCase();
      if (/micromessenger/.test(ua) && !/windowswechat/.test(ua)) {
        wechat.previewImage({
          urls: options.map(([k, p]) => getImageOrigin(p, k)),
          current: getImageOrigin(option, target),
        });
        return;
      }
    }
    // prepare data and open PhotoSwipe
    const items = options.map(([el, p]) => ({
      msrc: getImageThumb(p, el),
      src: getImageOrigin(p, el),
      w: p.w || el.naturalWidth || 0,
      h: p.h || el.naturalHeight || 0,
    }));
    photoswipe.open(items, { history: false, index: options.findIndex(({ 1: p }) => p === option) || 0 });
  };

  const update = (el, { arg, value }) => {
    let option = optionMap.get(el);
    // first time update, init el
    if (!option) {
      directiveIndex += 1;
      option = { directiveIndex };
      optionMap.set(el, option);
      el.addEventListener('click', onClick);
    }
    // update props
    if (typeof value === 'string') {
      option.group = value;
    } else if (typeof value === 'object' && value !== null) {
      option.group = value.group;
      option.index = value.index;
      option.origin = value.origin;
      option.gallery = value.gallery;
    }
    if (arg && typeof arg === 'string') {
      option.group = arg;
    }
  };

  const remove = (el) => {
    if (!optionMap.has(el)) {
      return;
    }
    optionMap.delete(el);
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
