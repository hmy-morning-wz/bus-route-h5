<template>
  <div class="busMap">
  <div id="container" class="map"></div>
  <div class='address'>
      <div id='address'>{{address}}</div>
      <div @click="handleSure">确定</div>
      <!-- <div class='c'>最近的路口:</div>
      <div id='nearestJunction'>{{nearestJunction}}</div>
      <div class='c'>最近的路:</div>
      <div id='nearestRoad'>{{nearestRoad}}</div> -->
  </div>
  </div>
</template>

<script>
import inquiryService from "../../service/index/inquiry.js";
import { Toast } from 'mint-ui';
export default {
  data: function () {
    return {
      urlType: this.$route.query.urlType,
      editId: this.$route.query.editId,
      address: '',
      nearestJunction: '',
      nearestRoad: '',
      startPostion: sessionStorage.getItem("location") || "120.151195,30.258105",
      position: "",
      result: "",
    }
  },
  mounted () {
      document.querySelector('.busMap').style.height = document.documentElement.clientHeight + 'px'
      document.querySelector('#container').style.height =  (window.screen.height - 200) + 'px'
      this.getAddress();
  },
  computed: {
  },
  methods: {
    getAddress(){
      const that = this
      AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
      const map = new AMap.Map('container', {
        zoom: 16,
        resizeEnable: true,
        center: [that.startPostion.split(",")[0],that.startPostion.split(",")[1]],
        scrollWheel: false
      })
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: map
      });
      positionPicker.on('success', function (positionResult) {
        that.address  = positionResult.address;
        that.nearestJunction  = positionResult.nearestJunction;
        that.nearestRoad  = positionResult.nearestRoad;
        that.position  = positionResult.position;
        that.result = JSON.parse(JSON.stringify(positionResult))
      });
      positionPicker.on('fail', function (positionResult) {
        that.address  = positionResult.address;
        that.nearestJunction  = positionResult.nearestJunction;
        that.nearestRoad  = positionResult.nearestRoad;
        that.position  = positionResult.position;
      });
      positionPicker.start();
    });
    },
    async handleSure(){
      let name;
      if(Array.isArray(this.result.regeocode.aois && this.result.regeocode.aois.length > 0)){
        name = this.result.regeocode.aois[0].name;
      }else{
        name = this.result.address;
      }
      let router;
      if(this.$route.query.location){
        let startLocation;
        let startName;
        let endLocation;
        let endName;
        let data = {
          userId: sessionStorage.getItem("userId"),
          longitudeStart: "",
          latitudeStart: "",
          longitudeEnd: "",
          latitudeEnd: "",
          placeNameStart: "",
          placeNameEnd: "",
       };
        if(this.$route.query.type === 'end'){
          if(this.$route.query.location === ','){
            if(this.urlType === 'index'){
              router = `/index?location=${this.position}&name=${name}&type=${this.$route.query.type}`;
            }else{
              router = `/homePage?location=${this.position}&name=${name}&type=${this.$route.query.type}`;
            }
            this.$router.replace(router);
            return
          }
          startLocation = this.$route.query.location;
          data.longitudeStart = startLocation.split(",")[0];
          data.latitudeStart = startLocation.split(",")[1];
          data.longitudeEnd = this.position.lng;
          data.latitudeEnd = this.position.lat;
          startName = this.$route.query.addressName;
          endLocation = this.position;
          endName = name;
        }else{
          startLocation = this.position;
          startName = name;
          endLocation = this.$route.query.location
          endName = this.$route.query.addressName;
          data.longitudeStart = startLocation.lng;
          data.latitudeStart = startLocation.lat;
          data.longitudeEnd = endLocation.split(",")[0];
          data.latitudeEnd = endLocation.split(",")[1];
        }
        data.placeNameStart = startName;
        data.placeNameEnd = endName;
        await this.addOrUpdateIndexPoints(data)
        if(startName === endName){
            Toast({
                  message: `起点与终点位置不能相同！`,
                  position: "middle",
                  duration: 1000
              });
            return
        }
        router = `/queryResult?startLocation=${startLocation}&startName=${startName}&endLocation=${endLocation}&endName=${endName}`;
      }else{
         if(this.$route.query.type !== 'start' && this.$route.query.type !== 'end' ){
          const param = {
            longitude: this.position.lng,
            latitude: this.position.lat,
            placeName: name,
         }
         if(this.editId) param.id = this.editId;
          await this.addCollectionPoints(param)
        }
        if(this.urlType === 'index'){
          router = `/index?type=${this.$route.query.type}&location=${this.position}&name=${name}`;
        }else{
          router = `/homePage?type=${this.$route.query.type}&location=${this.position}&name=${name}`;
        }
      }
      this.$router.replace(router);
    },
       //新增首页历史记录
    addOrUpdateIndexPoints(value) {
      return inquiryService.addOrUpdateIndexPoints(value).then(
        response => {

        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    addCollectionPoints(value) {
      let data = {
        userId:  sessionStorage.getItem("userId"),
        longitude: value.longitude,
        latitude: value.latitude,
        placeName: value.placeName,
      };
      if(this.$route.query.editId) data.id = this.$route.query.editId;
     switch (this.$route.query.type) {
       case 'home':
         data.pointType	 = 1
         break;
      case 'company':
         data.pointType	 = 2
         break;
      case 'other':
         data.pointType	 = 3
         break;
       default:
         break;
     }
      return inquiryService.addCollectionPoints(data).then(
        response => {
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
  }
}
</script>
<style lang="scss" scoped>
.busMap{
  background: #fff;
  height: 100%;
}
#container{
  width: 100%;
  height: auto;
}
.address{
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  font-size: .4rem /* 30/75 */;
  font-family:PingFangSC;
  font-weight:400;
  margin-top: 10px;
  div:nth-child(1){
      height: 50px;
      line-height: 50px;
      margin-left: 10px;
      width: 8.266667rem /* 620/75 */;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  div:nth-child(2){
      height: 50px;
      line-height: 50px;
    color: #1890FF;
    margin-left: .266667rem /* 20/75 */;
  }
}
</style>
