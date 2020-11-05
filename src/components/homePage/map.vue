<template>
  <div class="busMap">
       <div class="weather" @click="handleWeater" seed="天气icon">
        <img :src="dayimg" alt="">
        <span>{{daytemp}}°</span>
      </div>
      <div class="location" @click="handleReset" seed="位置重置icon"></div>
      <div class="search" @click="handleSearch" seed="线路搜索icon"></div>
      <img class="banner" v-if="bopBanner.icon_img" @click="handleBanner(bopBanner.url_type,bopBanner.url_path,bopBanner.url_remark)" :src="bopBanner.icon_img" :seed="bopBanner.icon_name" alt="">
    <div id="container" class="map">

    </div>
  </div>
</template>

<script>
import inquiryService from "../../service/index/inquiry.js";
export default {
  props: ["weather","location","watherDay","bopBanner"],
  data() {
    return {
      userId: this.$route.query.userId || sessionStorage.getItem("userId"),
      address: "",
      nearestJunction: "",
      nearestRoad: "",
      // startPostion:  sessionStorage.getItem("location") || "120.151195,30.258105",
      position: "",
      result: "",
      daytemp: '',
      dayimg: '',
      weaterDetail:'',
        weatherIcon: [
        {
          img: 'https://images.allcitygo.com/sun.png',
          name: "晴",
        },
        {
          img: 'https://images.allcitygo.com/rain.png',
          name: "雨",
        },
        {
          img: 'https://images.allcitygo.com/cloud.png',
          name: "云",
        },
        {
          img: 'https://images.allcitygo.com/Overcast.png',
          name: "阴",
        },
        {
          img: 'https://images.allcitygo.com/wind.png',
          name: "风",
        },
        {
          img: 'https://images.allcitygo.com/snow.png',
          name: "雪",
        },
        {
          img: 'https://images.allcitygo.com/yujiaxue.png',
          name: "雨夹雪",
        },
        {
          img: 'https://images.allcitygo.com/wu.png',
          name: "雾",
        },
        {
          img: 'https://images.allcitygo.com/mai.png',
          name: "霾",
        },
      ],
    };
  },
  mounted() {
    document.querySelector(".busMap").style.height = document.documentElement.clientHeight + "px";
    document.querySelector("#container").style.height = (window.screen.height-90) + "px";
    // this.getAddress();
  },
  computed: {},
  methods: {
    handleReset(){
      this.getAddress();
    },
    handleBanner(type,url,remark){
      if(type === 'miniapp'){
        my.postMessage({method:"navigateToMiniProgram",param:{data:{cityCode:this.cityCode},appId:remark}})
      }else if(type=== 'h5Out'){
        my.postMessage({method:"h5Out",param:{"navigateOuter":"true","type":"h5Out","url":url,appId:remark}})
      }else{
        this.$router.push(url);
      }
    },
    getAddress() {
      const that = this;
      AMapUI.loadUI(["misc/PositionPicker"], function(PositionPicker) {
        const map = new AMap.Map("container", {
          zoom: 16,
          resizeEnable: true,
          center: [
            that.location.split(",")[0],
            that.location.split(",")[1]
          ],
          scrollWheel: false
        });
        const positionPicker = new PositionPicker({
          mode: "dragMap",
          map: map
        });
        positionPicker.on("success", function(positionResult) {
          that.address = positionResult.address;
          that.nearestJunction = positionResult.nearestJunction;
          that.nearestRoad = positionResult.nearestRoad;
          that.position = positionResult.position;
          that.result = JSON.parse(JSON.stringify(positionResult));
          that.$emit("value-map-position", positionResult.position);
          console.log(positionResult.position,11111111)
        });
        positionPicker.on("fail", function(positionResult) {
          that.address = positionResult.address;
          that.nearestJunction = positionResult.nearestJunction;
          that.nearestRoad = positionResult.nearestRoad;
        });
        positionPicker.start();
      });
    },
    handleSearch(){
      const location = sessionStorage.getItem("location")
      let router;
      if(location && location !== ',')
      {
        router = `/index?userId=${this.userId}&location=${location}&name=我的位置&type=start`;
      }else{
        router = `/index?userId=${this.userId}&location=${location}`;
      }
      this.$router.push(router);
    },
    handleWeater(){
      this.$emit("value-map-weather");
    }
  },
  watch:{
    watherDay(){
      this.daytemp = this.watherDay[0].temperature;
    },
    weather(){
      this.weatherIcon.forEach((item,index) => {
        if(this.weather.casts[0].dayweather.indexOf(item.name) > -1){
            this.dayimg = item.img
        }
      })
    },
    location(){
      this.getAddress()
    }
  }
};
</script>
<style>
/* .amap-ui-misc-positionpicker {
    width: 0;
    height: 0;
    overflow: visible;
    position: absolute;
    top: 40% !important;
    left: 50%;
} */
</style>
<style lang="scss" scoped>
.map {
  position: relative;
}
 .weather {
    position: fixed;
    top: 3.733333rem /* 280/75 */;
    left: 7.853333rem /* 589/75 */;
    width: 1.72rem /* 129/75 */;
    height: .853333rem /* 64/75 */;
    background-color: #fff;
    box-shadow: 0 .026667rem /* 2/75 */ .08rem /* 6/75 */ 0 rgba(0, 0, 0, 0.1);
    border-radius: .48rem /* 36/75 */;
    z-index: 1000;
    display: flex;
    align-items: center;
    img{
      width: .64rem /* 48/75 */;
      height: .64rem /* 48/75 */;
      margin-left: .133333rem /* 10/75 */;
    }
    div{
      font-size:.426667rem /* 32/75 */;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(9,30,66,1);
      line-height:.64rem /* 48/75 */;
    }
  }
  .location{
    position: fixed;
    background: url("../../assets/images/location.png") no-repeat;
    box-shadow:0 .026667rem /* 2/75 */ .08rem /* 6/75 */ 0px rgba(0,0,0,0.1);
    background-size: 100% 100%;
    width: 1.28rem /* 96/75 */;
    height: 1.28rem /* 96/75 */;
    border-radius: 1.28rem /* 96/75 */;
    top: 5.2rem /* 390/75 */;
    left: 8.293333rem /* 622/75 */;
    z-index: 1000;
  }
  .banner{
    position: fixed;
    top: .533333rem /* 40/75 */;
    left: .426667rem /* 32/75 */;
    z-index: 1000;
    width: 1.2rem /* 90/75 */;
    height: 1.2rem /* 90/75 */;
  }
  .search{
    position: fixed;
    background: url("../../assets/images/line-inquiry.png") no-repeat;
    box-shadow:0 .026667rem /* 2/75 */ .08rem /* 6/75 */ 0px rgba(0,0,0,0.1);
    background-size: 100% 100%;
    width: 1.28rem /* 96/75 */;
    height: 1.28rem /* 96/75 */;
    border-radius: 1.28rem /* 96/75 */;
    top: 6.8rem /* 510/75 */;
    left: 8.293333rem /* 622/75 */;
    z-index: 1000;
  }
.busMap {
  background: #fff;
  height: 100%;
}
#container {
  width: 100%;
  height: auto;
}
</style>
