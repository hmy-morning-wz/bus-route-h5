<template>
  <div class="">
      <div id="container" class="map" ></div>
  </div>
</template>
<script>
// import goodService from "../../service/index.js";
import axios from 'axios';
export default {
  data() {
   const self = this;
          return {
            center: [120.195704,30.230936],
            lng: 0,
            lat: 0,
      }
    },
  components: {},
  created() {},
  computed: {},
  methods: {
    test(){
      var marker, map = new AMap.Map("container", {
        resizeEnable: true,
        center: [120.195704,30.230936],
        zoom: 13
    });
    marker = new AMap.Marker({
            icon: "http://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
            position: [120.195704,30.230936],
            offset: new AMap.Pixel(-13, -30)
        });
        marker.setMap(map);
    }
  },
  mounted() {
    console.log(111111)
      this.test()
  },
  watch: {}
};
</script>

<style lang="scss" scoped >

// @import "index.styl";
</style>
