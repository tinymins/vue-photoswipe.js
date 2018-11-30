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
          <button v-show="showClose" class="pswp__button pswp__button--close" title="Close (Esc)"></button>
          <button v-show="showShare" class="pswp__button pswp__button--share" title="Share"></button>
          <button v-show="showFullscreen" class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
          <button v-show="showZoom" class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
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
        <button v-show="showArrow" class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
        <button v-show="showArrow" class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint no-param-reassign: "off" */
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI from 'photoswipe/dist/photoswipe-ui-default';

export default {
  props: {
    showClose: {
      type: Boolean,
      default: true,
    },
    showShare: {
      type: Boolean,
      default: true,
    },
    showFullscreen: {
      type: Boolean,
      default: true,
    },
    showZoom: {
      type: Boolean,
      default: true,
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
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
        this[k] = v;
      });
    },
    async open(items, options) {
      return new Promise((resolve) => {
        this.photoswipe = new PhotoSwipe(this.$el, PhotoSwipeUI, items, options);
        // Auto fix wrong image size after loaded
        this.photoswipe.listen('gettingData', (_, item) => {
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
              this.photoswipe.invalidateCurrItems();
              this.photoswipe.updateSize(true);
            }
          };
          img.src = item.src; // start loading image
        });
        this.photoswipe.listen('close', resolve);
        this.photoswipe.init();
      });
    },
    close() {
      if (!this.photoswipe) {
        return;
      }
      this.photoswipe.close();
    },
  },
};
</script>
