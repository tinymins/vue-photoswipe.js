<template>
  <div style="text-align: center;">
    <div style="padding: 15px 0;">PhotoSwipe for Vue.js</div>
    <div @click="onclick" ref="$container">
      <img src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      <img src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
      <img src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
    </div>
    <img v-photoswipe src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
    <img v-photoswipe:group1 src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
    <img v-photoswipe:group1 src="https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
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
