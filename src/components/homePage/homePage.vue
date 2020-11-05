<template>
  <div class="homePage">
    <Map @value-map-weather="handleOpenWeather" @value-map-position="handlePosition" :weather="weatherObj" :location="mapLocation" :watherDay="currentWeather" :bopBanner="bopBanner"></Map>
    <Weather v-if="weatherIsShow" @value-weather="handleWeather" :animation='moveType' :weather="weatherObj" :watherDay="currentWeather"></Weather>
    <div class="bg" style="z-index:1100" v-show="currentState === 'top'"></div>
    <div class="line-inquiry" :class="trafficClassObject"  @touchstart="touchStart()" @touchend="touchEnd()" @touchmove.prevent>
      <img class="arrow-down" v-show="currentState === 'top'" src="../../assets/images/arrow-down.png" alt="">
      <div class="arrow-middle" v-show="currentState === 'middle'"></div>
      <img class="arrow-down" v-show="currentState === 'bottom'" src="../../assets/images/arrow_up.png" alt="">
      <div class="position mb32">
        <div class="left"></div>
        <div class="middle">
          <div class="first-line" :class="{ selectColor: noValue === 'start' || !locationType}" @click="handleGetAddress('start')" seed="我的位置">{{startText}}</div>
          <div class="second-line" :class="{ selectColor: noValue === 'end' || !locationType}" @click="handleGetAddress('end')" seed="输入终点位置">{{endText}}</div>
        </div>
        <div class="right" @click="handleChange"></div>
      </div>
      <div class="location-set">
        <div class="line"></div>
        <div class="header">
          <div class="left">常用地点</div>
          <div class="right" @click="handleSetPosition">设置</div>
        </div>
        <div class="middle">
          <div class="comm-line comm-first-line">
            <div class="content black_color" @click="handleOtherRoute(home,'home')" v-if="home">
              <img src="../../assets/images/home.png" alt="">
              <div>{{home.placeName}}</div>
            </div>
            <div class="content" @click="handleOther('home')" v-else>
              <img src="../../assets/images/home.png" alt="">
              <div>添加地点</div>
            </div>
            <div class="content black_color" @click="handleOtherRoute(company,'company')" v-if="company">
              <div class="vertical-line"></div>
              <img src="../../assets/images/position.png" alt="">
              <div>{{company.placeName}}</div>
            </div>
            <div class="content" @click="handleOther('company')" v-else>
              <div class="vertical-line"></div>
              <img src="../../assets/images/position.png" alt="">
              <div>添加地点</div>
            </div>
          </div>
          <div class="comm-line">
            <div class="content black_color" v-for="(item,index) in otherList" :key="index" @click="handleOtherRoute(item,'other')">
              <div class="vertical-line" v-if="index != 0"></div>
              <img src="../../assets/images/place2.png" alt="">
              <div>{{item.placeName}}</div>
            </div>
            <div class="content" @click="handleOther('other')" seed="添加常用地点" v-if="otherList.length < 2">
              <div class="vertical-line"></div>
              <img src="../../assets/images/plus.png" alt="">
              <div>添加常用地点</div>
            </div>
          </div>
        </div>
      </div>
      <div class="traffic-service">
        <div class="line"></div>
        <div class="title">公交服务</div>
        <div class="content">
          <div class="kuang" v-for="(item,index) in traffic" :key="index":class="{ mr91: index !== 3}"  @click="handleProgram(item.url_type,item.url_path,item.url_remark)" :seed="item.icon_name">
            <img :src="item.icon_img" alt="">
            <div class="mb32">{{item.icon_name}}</div>
          </div>
        </div>
        <img class="banner" v-if="bottomBanner.icon_img" :src="bottomBanner.icon_img"  @click="handleProgram(bottomBanner.url_type,bottomBanner.url_path,bottomBanner.url_remark)" :seed="bottomBanner.icon_name">
        <div class="popup-bottom" v-else></div>
      </div>
    </div>
    <div class="bg" v-show="editShow">
        <div class="edit-address">
          <div class="bottom-line" @click="handleSet('set')" v-if="this.editType !== 'other'">重新设置地址</div>
          <div class="bottom-line" @click="handleSet('clear')">清空地址</div>
          <div
            class="bottom-line"
            @click="handleSet('cancel')"
          >取消</div>
        </div>
    </div>
    <div class="bg"  @touchstart="touchStart()" @touchend="handleMove()" v-if="bgIsShow">
      <img class="arrow p_arrow" src="../../assets/images/first-arrow.png" alt="">
      <div class="more">上滑探索更多</div>
    </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";
import { templateId} from '../../config/index';
import animation from "../../assets/css/animation.css";
import Map from "../homePage/map";
import Weather from "../homePage/weather";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import { getDirection } from "../../utils/move.js";

export default {
  data() {
    return {
      userId: this.$route.query.userId,
      AMP_WEB_KEY: "5d1564203934a57a268d0ef563babc03",
      moveType:1,
      currentState: 'middle',
      trafficClassObject: {
        p1_chip1: false,
        p1_chip2: false,
        p1_chip3: false,
        p1_chip4: false,
      },
      weatherIsShow: false, //天气组件是否展示
      weatherObj: [],
      currentWeather: [],
      noValue: "end",
      location: this.$route.query.location,
      startText: "我的位置",
      endText: "输入终点",
      lng: '',
      lat: '',
      mapLocation: "",
      locationType: true,
      otherList: [],
      company: {},
      home: {},
      cityCode: "",
      historyList: [],
      editShow: false,
      editType: "",
      editId: 0,
      pageNum: 1,
      startx: 0,
      starty: 0,
      bgIsShow: false,
      traffic: [],
      bopBanner: {},
      bottomBanner: {
        url_remark: "",
        icon_img: "",
        url_type: "",
        icon_name: "",
        url_data: "",
        url_path: null
      },
    };
  },
  components: {
    Map,
    Weather
  },
  created() {},
  computed: {},
  methods: {
     handleProgram(type,url,remark){
      if(type === 'miniapp'){
        my.postMessage({method:"navigateToMiniProgram",param:{data:{cityCode:this.cityCode},appId:remark}})
      }else if(type=== 'h5Out'){
        my.postMessage({method:"h5Out",param:{"navigateOuter":"true","type":"h5Out","url":url,appId:remark}})
      }else{
        this.$router.push(url);
      }
    },
    handleSetPosition(type){
      let startLocation;
      let startName;
      let router;
      if (this.startText !== "我的位置" && this.startText !== "输入起点") {
        startLocation = `${this.lng},${this.lat}`;
        startName = this.startText;
      } else {
        startLocation = sessionStorage.getItem("location");
        startName = "我的位置";
      }
      if(this.locationType){
        router = `/setAddress?location=${this.lng},${this.lat}&addressName=${startName}`;
      }else{
        const location = ','
        router = `/setAddress?location=${location}&addressName=${startName}`;
      }
      sessionStorage.setItem("currentState",this.currentState);
      this.$router.push(router);
    },
    handleMove(){
      let endx, endy;
      endx = event.changedTouches[0].pageX;
      endy = event.changedTouches[0].pageY;
      let direction = getDirection(this.startx, this.starty, endx, endy);
      switch (direction) {
        case 0:
          // alert("未滑动！");
          break;
        case 1:
          this.bgIsShow = false;
          const element =  document.querySelector(`.line-inquiry`)
             if(this.currentState === 'middle'){
             this.trafficClassObject.p1_chip1 = true;
             this.trafficClassObject.p1_chip2 = false;
             this.trafficClassObject.p1_chip3 = false;
             this.trafficClassObject.p1_chip4 = false;
             element.addEventListener("animationend", ()=>{
                element.style.bottom = 0;
              },false);
            this.currentState = 'top';
          }
          this.addBrowse();
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          // alert("向右！")
          break;
        default:
      }
    },
    //滑动事件
    touchStart(e){
      this.startx = event.touches[0].pageX;
      this.starty = event.touches[0].pageY;
    },
    touchEnd(e){
      let endx, endy;
      endx = event.changedTouches[0].pageX;
      endy = event.changedTouches[0].pageY;
      let direction = getDirection(this.startx, this.starty, endx, endy);
      const element =  document.querySelector(`.line-inquiry`)
      switch (direction) {
        case 0:
          // alert("未滑动！");
          break;
        case 1:
          console.log("向上")
          if(this.currentState === 'middle'){
             this.trafficClassObject.p1_chip1 = true;
             this.trafficClassObject.p1_chip2 = false;
             this.trafficClassObject.p1_chip3 = false;
             this.trafficClassObject.p1_chip4 = false;
             element.addEventListener("animationend", ()=>{
                element.style.bottom = 0;
              },false);
            this.currentState = 'top';
          }else if(this.currentState === 'bottom'){
             this.trafficClassObject.p1_chip1 = false;
             this.trafficClassObject.p1_chip2 = false;
             this.trafficClassObject.p1_chip3 = false;
             this.trafficClassObject.p1_chip4 = true;
            element.addEventListener("animationend", ()=>{
              element.style.bottom = `-6.159rem`;
            },false);
            this.currentState = 'middle'
          }
          break;
        case 2:
          if(this.currentState === 'top'){
              this.trafficClassObject.p1_chip1 = false;
              this.trafficClassObject.p1_chip2 = true;
              this.trafficClassObject.p1_chip3 = false;
              this.trafficClassObject.p1_chip4 = false;
             element.addEventListener("animationend", ()=>{
                element.style.bottom = `-6.159rem`;
              },false);
            this.currentState = 'middle';
          }else if(this.currentState === 'middle'){
             this.trafficClassObject.p1_chip1 = false;
             this.trafficClassObject.p1_chip2 = false;
             this.trafficClassObject.p1_chip3 = true;
             this.trafficClassObject.p1_chip4 = false;
             element.addEventListener("animationend", ()=>{
               element.style.bottom = `-10.959rem`;
              },false);
            this.currentState = 'bottom';
          }
          break;
        case 3:
          // alert("向左！")
          break;
        case 4:
          // alert("向右！")
          break;
        default:
      }
    },
    //关闭天气组件
    handleWeather(){
      this.moveType = 2
      const element =  document.querySelector(`.content`)
      element.addEventListener("animationend", ()=>{
              this.weatherIsShow = false;
      },false);
    },
    //打开天气组件
    handleOpenWeather(){
      this.weatherIsShow = true;
      this.moveType = 1
    },
    handlePosition(value){
      this.lng = value.lng;
      this.lat = value.lat;
    },
    getLongitude() {
      const that = this;
      if (window.AlipayJSBridge) {
        AlipayJSBridge.call(
          "getCurrentLocation",
          { requestType: 2, bizType: "didi" },
          function(result) {
            if (result.error) {
              that.locationType = false;
              that.startText = '输入起点';
              that.mapLocation = "120.151195,30.258105";
              return;
            }
            // const setAddressType = that.$route.query.type;
            // if( setAddressType === 'other' || setAddressType === 'home' || setAddressType === 'company' && !sessionStorage.getItem("location")){
            //   const param = {
            //     longitude: result.longitude,
            //     latitude: result.latitude,
            //     placeName: `${result.streetNumber.street}${result.streetNumber.number}`,
            //   }
            //   that.addCollectionPoints(param)
            // }
            that.cityCode = result.cityAdcode;
            that.lng = result.longitude;
            that.lat = result.latitude;
            // const location = `${that.lng},${that.lat}`;
            that.mapLocation = `${that.lng},${that.lat}`;
            const myAddress = `${result.streetNumber.street}${result.streetNumber.number}`;
            sessionStorage.setItem("location",that.mapLocation);
            sessionStorage.setItem("myAddress", myAddress);
            sessionStorage.setItem("locationCity", result.city);
            sessionStorage.setItem("cityAdcode", result.cityAdcode);
            that.getWeatherList()
          }
        );
      }
    },
    handleGetAddress(index) {
      let router = "";
      if (index === this.noValue) {
        let name;
        let type;
        index === "start" ? (name = this.endText) : (name = this.startText);
        index === "start" ? type = 'end' : type = 'start';
        // if(index === 'start'){
        //   type = 'end';
        // }else{
        //   type = 'start';
        // }
        if(!this.locationType){
            this.lng = '';
            this.lat = '';
        }
        router = `/index?userId=${this.userId}&type=${type}&location=${this.lng},${this.lat}&name=${name}`;
      } else {
        if(this.lng){
            let name;
            let type;
          index === "start" ? name = this.startText : name = this.endText;
          index === "start" ? type = 'start' : type = 'end';
          if(!this.locationType){
            this.lng = '';
            this.lat = '';
          }
          router = `/index?userId=${this.userId}&type=${type}&location=${this.lng},${this.lat}&name=${name}`;
        }else{
          router = `/index?userId=${this.userId}&type=${index}`;
        }
      }
      sessionStorage.setItem("currentState",this.currentState);
      this.$router.push(router);
    },
    handleChange() {
      if (this.noValue === "start") {
        this.noValue = "end";
        if (
          this.$route.query.name &&
          (this.$route.query.type === "start" ||
            this.$route.query.type === "end")
        ) {
          this.startText = this.$route.query.name;
        } else {
          this.locationType ? this.startText= '我的位置' : this.startText= '输入起点';
        }
        this.endText = "输入终点";
      } else {
        if (
          this.$route.query.name &&
          (this.$route.query.type === "start" ||
            this.$route.query.type === "end")
        ) {
          this.endText = this.$route.query.name;
        } else {
          this.locationType ? this.endText= '我的位置' : this.endText= '输入终点'
        }
        this.noValue = "start";
        this.startText = "输入起点";
      }
    },
    //清空历史记录
    handleClear() {
      MessageBox.confirm("",{
	      title:'',
	      message:'清空历史记录？',
	      confirmButtonText:'立即清空',
        cancelButtonText:'取消',
        cancelButtonClass: 'cancleButton',
        confirmButtonClass: 'confirmButton'
        })
        .then(action => {
          this.getClearIndex();
        })
        .catch(() => {});
    },
    //点击其他地址跳转到结果页面
    handleOtherRoute(value,type) {
      let startLocation;
      let startName;
      let router;
      if (this.startText !== "我的位置" && this.startText !== "输入起点") {
        startLocation = `${this.lng},${this.lat}`;
        startName = this.startText;
      } else {
        startLocation = sessionStorage.getItem("location");
        startName = "我的位置";
      }
      const endLocation = `${value.longitude},${value.latitude}`;
       if (this.lat == value.latitude && this.lng == value.longitude){
         router = `/index?userId=${this.userId}&type=${type}&location=${endLocation}&name=${value.placeName}`;
      }
      if(this.locationType){
        router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(startName)}&endLocation=${endLocation}&endName=${encodeURIComponent(value.placeName)}`;
      }else{
        router = `/index?userId=${this.userId}&type=${type}&location=${endLocation}&name=${value.placeName}`;
      }
      sessionStorage.setItem("currentState",this.currentState);
      this.$router.push(router);
    },
    handleindexRoute(value) {
      const startLocation = `${value.longitudeStart},${value.latitudeStart}`;
      const endLocation = `${value.longitudeEnd},${value.latitudeEnd}`;
      const router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(value.placeNameStart)}&endLocation=${endLocation}&endName=${encodeURIComponent(value.placeNameEnd)}`;
      sessionStorage.setItem("currentState",this.currentState);
      this.$router.push(router);
    },
    //设置其他地址
    handleOther(value) {
      if (this.otherList.length >= 10) {
        Toast({
          message: `最多添加10个地点！`,
          position: "middle",
          duration: 1000
        });
        return;
      }
      const router = `/getAddress?type=${value}&urlType=homePage`;
      sessionStorage.setItem("currentState",this.currentState);
      this.$router.push(router);
    },
    handleEdit(id, type) {
      event.stopPropagation();
      this.editShow = true;
      this.editType = type;
      this.editId = id;
    },
    //收藏地址设置
    handleSet(value) {
      if (value === "set") {
        const router = `/getAddress?type=${this.editType}&editId=${this.editId}&urlType=homePage`;
        sessionStorage.setItem("currentState",this.currentState);
        this.$router.push(router);
      } else if (value === "clear") {
        this.deleteCollectionPoints(this.editId);
      } else {
        this.editShow = false;
      }
    },
       //新增收藏地址接口
    addCollectionPoints(value) {
      let data = {
        userId: this.userId || sessionStorage.getItem("userId"),
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
          this.getCollectionPoints();
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //获取收藏地址接口
    getCollectionPoints(value) {
      const userId = this.userId || sessionStorage.getItem("userId");
      return inquiryService.getCollectionPoints(userId).then(
        response => {
          this.home = response.data.home;
          this.company = response.data.company;
          if(response.data.otherPoints && response.data.otherPoints.length > 0)
          this.otherList = response.data.otherPoints.slice(0,2);

        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //删除收藏地址接口
    deleteCollectionPoints(id) {
      return inquiryService.deleteCollectionPoints(id).then(
        response => {
          this.getCollectionPoints();
          this.editShow = false;
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //获取首页列表地址接口
    getIndexHistory(value) {
      const userId = this.userId || sessionStorage.getItem("userId");
      const data = {
        pageNum: this.pageNum,
        pageSize: 10,
        userId: userId
      };
      return inquiryService.getIndexHistory(data).then(
        response => {
          if(Array.isArray(response.data.records))
          this.historyList = response.data.records.slice(0,2);
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //清空首页历史记录
    getClearIndex(value) {
      const userId = this.userId || sessionStorage.getItem("userId");
      const data = {
        userId: userId
      };
      return inquiryService.getClearIndex(data).then(
        response => {
          this.historyList = [];
          this.editShow = false;
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    getWeatherList() {
      const data = {
        webKey: this.AMP_WEB_KEY,
        cityd: this.cityCode || 330100,
        extensions: 'all',
      };
      inquiryService.getWeatherList(data).then(
        response => {
          this.weatherObj = JSON.parse(JSON.stringify(response.forecasts[0]));
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
    getWeatherList2() {
      const data = {
        webKey: '5d1564203934a57a268d0ef563babc03',
        cityd: this.cityCode || 330100,
        extensions: 'base',
      };
      inquiryService.getWeatherList(data).then(
        response => {
         this.currentWeather = response.lives;
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
    getIconList() {
      const data = {
        "appId":"2019070165729327",
        "aliUserId": this.userId || sessionStorage.getItem("userId"),
        "locationId":"icon",
        "templateId":templateId,
      };
      inquiryService.getIconList(data).then(
        response => {
          this.traffic = JSON.parse(JSON.stringify(response.data.ele_icons))
          this.bopBanner= JSON.parse(JSON.stringify(response.data.route_top_banner))
          this.bottomBanner= JSON.parse(JSON.stringify(response.data.route_bottom_banner))
          if(this.traffic.length > 4) this.traffic = this.traffic.slice(0,4)
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
    addBrowse() {
      const data = {
        "userId":this.userId || sessionStorage.getItem("userId"),
      };
      inquiryService.addBrowse(data).then(
        response => {
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
    checkBrowse() {
      const data = {
        "userId":this.userId || sessionStorage.getItem("userId"),
      };
      inquiryService.checkBrowse(data).then(
        response => {
          this.bgIsShow = !response.data;
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
  },
  mounted() {
    if (this.userId) {
      sessionStorage.setItem("userId", this.userId);
    }
    if(sessionStorage.getItem("currentState")){
      const currentState = sessionStorage.getItem("currentState");
      this.currentState = currentState
      const element =  document.querySelector(`.line-inquiry`)
      if(currentState === 'top'){
        element.style.bottom = `0`;
      }else if(currentState === 'middle'){
        element.style.bottom = `-6.159rem`;
      }else{
        element.style.bottom = `-10.959rem`;
      }
    }
    // const location2 = `120.195704,30.230936`;
    // sessionStorage.setItem("location", location2);
    // this.mapLocation = `120.195704,30.230936`;
    if (this.location) {
      const type = this.$route.query.type;
      this.lng = this.location.split(",")[0];
      this.lat = this.location.split(",")[1];
      if(type === 'start' || type === 'end'){
        this.mapLocation = `${this.lng},${this.lat}`
      }else{
        this.mapLocation = sessionStorage.getItem("location") || "120.151195,30.258105";
      }
      if (type === "start") {
        this.startText = this.$route.query.name;
      } else if (type === "end") {
        this.endText = this.$route.query.name;
        this.noValue = "start";
        this.startText = "输入起点";
      }else{
        if(!sessionStorage.getItem("location") || sessionStorage.getItem("location") === 'null'){
            this.locationType = false;
            this.startText = "输入起点";
        }
      }
    } else {
      this.getLongitude();
      if (this.$route.query.type === "end") {
        this.noValue = "start";
        this.startText = "输入起点";
        this.endText = "我的位置";
      }
    }
    this.getCollectionPoints();
    this.getIndexHistory();
    this.getWeatherList()
    this.getWeatherList2()
    this.getIconList()
    this.checkBrowse()
  },
  watch: {}
};
</script>
<style>
.mint-msgbox{
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
    background-color: #fff;
    width: 7.306667rem /* 548/75 */;
    border-radius: .213333rem /* 16/75 */;
    font-size: 16px;
    -webkit-user-select: none;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transition: .2s;
    transition: .2s;
}
.mint-msgbox-message{
  font-size:16px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(9,30,66,1)
}
.cancleButton{
  color:#1890FF;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
}
.confirmButton{
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(24,144,255,1);
}
</style>

<style lang="scss" scoped >
.mb32{
  margin-bottom: .426667rem /* 32/75 */ !important;
}
.vertical-line{
  width:1px !important;
  height:.586667rem /* 44/75 */;
  background:rgba(0,0,0,0.1);
}
.homePage{
  // position: relative;
  position: fixed !important;
  width: 100%;
  height: 100%;
  overflow:hidden;
  .ml32 {
    margin-left: 0.426667rem /* 32/75 */;
    margin-right: 0.426667rem; /* 32/75 */
  }
  .selectColor {
    color: #7a869a !important;
  }
}
.line-inquiry {
  border-radius:.32rem /* 24/75 */ .32rem /* 24/75 */ 0px 0px;
  position: fixed;
  width: 100%;
  bottom: -6.159rem;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1110;
  overflow: hidden;
  background: #fff !important;
  .arrow-down{
    width: .64rem /* 48/75 */;
    height: .186667rem /* 14/75 */;
    display: block;
    margin: .106667rem /* 8/75 */ auto .133333rem /* 10/75 */;
  }
  .arrow-middle{
    width:.533333rem /* 40/75 */;
    height: .08rem /* 6/75 */;
    background:rgba(223,225,230,1);
    border-radius:.04rem /* 3/75 */;
    margin: .16rem /* 12/75 */ auto .186667rem /* 14/75 */
  }
  .common-location{
    height: 5.546667rem /* 416/75 */;
  }
  .position {
    width: 9.146667rem /* 686/75 */;
    height: 2.346667rem /* 176/75 */;
    background: rgba(244, 245, 247, 1);
    border-radius: 0.106667rem /* 8/75 */;
    margin: 0 /* 32/75 */ auto 0;
    display: flex;
    align-items: center;
    .left {
      background: url("../../assets/images/start.png") no-repeat;
      background-size: 100% 100%;
      width: 0.213333rem /* 16/75 */;
      height: 1.28rem /* 96/75 */;
      margin-left: 0.32rem /* 24/75 */;
    }
    .middle {
      margin-left: 0.32rem /* 24/75 */;
      color: #091e42;
      font-size: 0.4rem /* 30/75 */;
      font-family: PingFangSC;
      .first-line {
        height: 1.066667rem /* 80/75 */;
        line-height: 1.066667rem /* 80/75 */;
        position: relative;
        width: 7.28rem /* 546/75 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .first-line::after {
        content: "";
        height: 1px;
        background-color: #e8e8e8;
        position: absolute;
        left: 0;
        width: 100%;
        bottom: 0;
      }
      .second-line {
        height: 1.066667rem /* 80/75 */;
        line-height: 1.066667rem /* 80/75 */;
        width: 7.28rem /* 546/75 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .right {
      background: url("../../assets/images/change.png") no-repeat;
      background-size: 100% 100%;
      width: 0.586667rem /* 44/75 */;
      height: 0.586667rem /* 44/75 */;
      margin-left: auto;
      margin-right: 0.213333rem; /* 16/75 */
    }
  }
  .location-set{
    width: 100%;
    height: 4.8rem /* 360/75 */;
    .header{
      margin: 0 .426667rem /* 32/75 */;
      display: flex;
      height: 1.386667rem /* 104/75 */;
      align-items: center;
      position: relative;
      .left{
        font-size:.426667rem /* 32/75 */;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(9,30,66,1)
      }
      .right{
        margin-left: auto;
        font-size:.373333rem /* 28/75 */;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(122,134,154,1);
      }
    }
    .header::after{
        content: "";
        height: 1px;
        background-color: #e8e8e8;
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        bottom: 0;
    }
    .middle{
      margin: 0 .426667rem /* 32/75 */;
      .comm-first-line{
        position: relative;
      }
      .black_color{
        color:#091E42;
      }
      .comm-line{
        height: 1.6rem /* 120/75 */;
        display: flex;
        font-size:.373333rem /* 28/75 */;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(122,134,154,1);
        img{
          height: .64rem /* 48/75 */;
          width: .64rem /* 48/75 */;
        }
        .content{
          display: flex;
          flex: 1;
          align-items: center;
          div{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 2.666667rem /* 200/75 */;
          }
        }
      }
      .comm-first-line::after{
        content: "";
        height: 1px;
        background-color: #e8e8e8;
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        bottom: 0;
      }
    }
  }
  .line {
    height: 0.213333rem /* 16/75 */;
    width: 100%;
    background: rgba(244, 245, 247, 1);
  }
  .common-place {
    width: 9.146667rem /* 686/75 */;
    height: 2.133333rem /* 160/75 */;
    background: rgba(244, 245, 247, 1);
    border-radius: 0.106667rem /* 8/75 */;
    margin: 0 auto;
  }
  .set-address {
    display: flex;
    display: -webkit-flex;
    height: 1.6rem /* 120/75 */;
    align-items: center;
    -webkit-align-items: center;
    -ms-align-items: center;
    font-size: 0.4rem /* 30/75 */;
    font-family: PingFangSC;
    position: relative;
    .img {
      width: .64rem /* 48/75 */;
      height: .64rem /* 48/75 */;
      display: inline-block;
    }
    .middle {
      margin-left: 0.106667rem /* 8/75 */;
      color: #091e42;
      min-width: 0.746667rem /* 56/75 */;
      max-width: 7.166667rem /* 560/75 */;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .right {
      margin-left: 0.586667rem /* 44/75 */;
      color: #7a869a;
      width: 6.133333rem /* 460/75 */;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .icon {
      width: 0.346667rem /* 26/75 */;
      height: 0.346667rem /* 26/75 */;
      position: absolute;
      right: 0.32rem /* 24/75 */;
      z-index: 99;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    .word {
      color: #091e42;
      font-size: 0.4rem /* 30/75 */;
    }
  }
  .set-line {
    position: relative;
  }
  .set-line::after {
    content: "";
    height: 1px;
    background-color: #e8e8e8;
    position: absolute;
    left: 1.76rem /* 132/75 */;
    right: 0.853333rem /* 64/75 */;
    width: 6.533333rem /* 490/75 */;
    bottom: 0;
  }
  .set-line2 {
    position: relative;
  }
  .set-line2::after {
    content: "";
    height: 1px;
    background-color: #e8e8e8;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .add-place {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    height: 1.6rem /* 120/75 */;
    font-size:.373333rem /* 28/75 */;
    margin: 0 .426667rem /* 32/75 */;
    font-family:PingFangSC-Regular,PingFangSC;
    font-weight:400;
    color: #7A869A;
    div:nth-child(1){
      color:rgba(37,56,88,1);
      width: .64rem /* 48/75 */;
      height: .64rem /* 48/75 */;
      text-align: center;
    }
  }
  .popup-bottom{
    width: 100%;
    height: 2.4rem /* 180/75 */;
    background:rgba(244,245,247,1);
  }
  .banner{
    width: 9.36rem /* 702/75 */;
    height: 2.133333rem /* 160/75 */;
    margin: 0 auto .266667rem /* 20/75 */;
    display: block;
  }
}
.historyList {
  max-height: 5.226667rem /* 392/75 */;
  background: #fff;
  .clear-data {
    text-align: center;
    font-size:.373333rem /* 28/75 */;
    font-family:PingFangSC-Regul;
    font-weight: 400;
    color: #7A869A;
    height: 1.6rem /* 120/75 */;
    line-height: 1.6rem /* 120/75 */;
  }
}
.traffic-service{
  overflow: hidden;
  .title{
    font-size: .426667rem /* 32/75 */;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(9,30,66,1);
    line-height:1.386667rem /* 104/75 */;
    height:1.386667rem /* 104/75 */;
    margin-left: .426667rem /* 32/75 */;
  }
  .content{
    margin-left: 0.72rem;
    height: 2.16rem /* 162/75 */;
    .mr91{
      margin-right: 1.213333rem /* 91/75 */;
    }
    .kuang{
      font-size:.32rem /* 24/75 */;
      font-family:PingFangSC-Regular,PingFangSC;
      font-weight:400;
      color:rgba(9,30,66,1);
      // line-height:.533333rem /* 40/75 */;
      width: 1.28rem /* 96/75 */;
      margin-bottom: .533333rem /* 40/75 */;
      float: left;
      .kuang::after{
        content:' ';
        display: block;
        height:0;
        clear:both;
      }
      img{
        width: 1.226667rem /* 92/75 */;
        height: 1.226667rem /* 92/75 */;
        display: block;
      }
    }
  }
}
.bg {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1200;
  .edit-address {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1210;
    background: #fff;
    .grayColor {
      color: #7a869a;
    }
    .bottom-line {
      width: 100%;
      height: 1.28rem /* 96/75 */;
      line-height: 1.28rem /* 96/75 */;
      text-align: center;
      font-size: 0.4rem /* 30/75 */;
      font-family: PingFangSC;
      font-weight: 400;
      color: #091e42;
      position: relative;
    }
    .bottom-line::after {
      content: "";
      height: 1px;
      background-color: #e8e8e8;
      position: absolute;
      left: 0.426667rem /* 32/75 */;
      right: 0.426667rem /* 32/75 */;
      width: 9.146667rem /* 686/75 */;
      bottom: 0rem /* 16/75 */;
    }
  }
  .arrow{
    height: 4.44rem /* 333/75 */;
    width: .893333rem /* 67/75 */;
    margin: 8.293333rem /* 622/75 */ auto 0;
    display: block;
  }
  .more{
    width:4.266667rem /* 320/75 */;
    height:1.173333rem /* 88/75 */;
    line-height:1.173333rem /* 88/75 */;
    background:rgba(0,0,0,0.6);
    border-radius:.213333rem /* 16/75 */;
    font-size:.426667rem /* 32/75 */;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(255,255,255,1);
    text-align: center;
    margin: 0 auto;
  }
}
// @import "index.styl";
</style>
