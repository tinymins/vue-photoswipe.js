<template>
  <div style="text-align: center;">
    <div style="padding: 15px 0;">PhotoSwipe for Vue.js</div>
    <hr>
    div with event bindings
    <div class="container" @click="onclick" ref="$container">
      <img src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      <img src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      <img src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
    </div>
    <hr>
    img
    <div>
      <img v-photoswipe src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      <img v-photoswipe:group1 src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      <img v-photoswipe:group1 src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
    </div>
    <hr>
    div with background-origin
    <div class="container">
      <div v-photoswipe class="div-bg" style="background-origin: border-box;">div border-box</div>
      <div v-photoswipe class="div-bg" style="background-origin: content-box;">div content-box</div>
      <div v-photoswipe class="div-bg" style="background-origin: padding-box;">div padding-box</div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$photoswipe.listen('beforeChange', this.beforeChange);
  },
  beforeDestroy() {
    this.$photoswipe.unlisten('beforeChange', this.beforeChange);
  },
  methods: {
    beforeChange(...args) {
      console.log('beforeChange', ...args); // eslint-disable-line
    },
    onclick(e) {
      const items = [];
      let index = 0;
      let $el = this.$refs.$container.firstElementChild;
      while ($el) {
        if ($el instanceof HTMLImageElement) {
          if ($el === e.target) {
            index = items.length;
          }
          items.push({
            $el,
            src: $el.src,
          });
        }
        $el = $el.nextElementSibling;
      }
      this.$photoswipe.open(items, { index });
    },
  },
};
</script>

<style lang="css" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.div-bg {
  width: 272px;
  height: 92px;
  margin: 9.2px 27.2px;
  padding: 9.2px 27.2px;
  border-top: 9.2px solid #00000033;
  border-right: 27.2px solid #00000033;
  border-bottom: 9.2px solid #00000033;
  border-left: 27.2px solid #00000033;
  background: url(https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png);
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
