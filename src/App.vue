<template>
  <div style="text-align: center;">
    <div style="padding: 15px 0;">PhotoSwipe for Vue.js</div>
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
  },
};
</script>
