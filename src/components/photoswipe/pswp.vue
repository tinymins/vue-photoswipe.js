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
      <div class="pswp__container" @mousewheel.prevent="onMouseWheel">
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
        <div
          class="pswp__caption"
          @MSPointerDown="onCaptionDown"
          @MSPointerMove="onCaptionMove"
          @MSPointerUp="onCaptionUp"
          @pointerdown="onCaptionDown"
          @pointermove="onCaptionMove"
          @pointerup="onCaptionUp"
          @touchstart="onCaptionDown"
          @touchmove="onCaptionMove"
          @touchend="onCaptionUp"
          @mousedown="onCaptionDown"
          @mousemove="onCaptionMove"
          @mouseup="onCaptionUp"
        >
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
      captionUpTime: 0,
      photoswipe: null,
      items: [],
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
      this.items = items
        .filter(item => item && item.src)
        .map(item => Object.assign({ w: 0, h: 0 }, item));
      return this.openPswp(this.items, options);
    },
    close() {
      return this.closePswp();
    },
    onCaptionDown(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onCaptionMove(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    onCaptionUp(e) {
      const i = this.photoswipe.getCurrentIndex();
      const item = this.items[i];
      const captionUpTime = new Date().valueOf();
      if (item) {
        if (item.onTitleClick && captionUpTime - this.captionUpTime > 50) {
          this.captionUpTime = captionUpTime;
          item.onTitleClick(item.customEventData);
        }
        this.photoswipe.shout('title-click', item.customEventData);
      }
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseWheel(e) {
      let ratio = 1.4;
      if (e.deltaY > 0) {
        ratio = 1 / ratio;
      }
      this.photoswipe.zoomTo(this.photoswipe.getZoomLevel() * ratio, null, 200);
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
  },
};
</script>

<style>
@import "~photoswipe/dist/photoswipe.css";
@import "~photoswipe/dist/default-skin/default-skin.css";
</style>
