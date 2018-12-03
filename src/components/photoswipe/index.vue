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
