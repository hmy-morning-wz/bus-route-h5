<template>
  <div class="line-inquiry">
    <div class="search-header">
        <div class="position">
          <div class="left"></div>
          <div class="middle">
            <div class="first-line" seed="我的位置">
              <input v-model="startText"  placeholder="输入起点" @input="handleQuery(startText)" @focus="startFocus">
            </div>
            <div class="second-line"  seed="输入终点位置">
              <input v-model="endText"  placeholder="输入终点" @input="handleQuery(endText)" @focus="endFocus">
            </div>
          </div>
          <div class="right" @click="handleChange"></div>
        </div>
    </div>
    <div class="search-header2"></div>
    <div class="detail" v-show="positionIsShow">
        <div class="left" @click="handleMyAddress" seed="我的位置选点">
          <img src="../../assets/images/site.png" alt="">
          <span>我的位置</span>
        </div>
        <div class="middle"></div>
        <div class="right" @click="handleMap" seed="点击地图选点">
          <img src="../../assets/images/place.png" alt="">
          <span>地图选点</span>
        </div>
    </div>
    <div class="historyList" v-if="historyList.length>0 && resultList.length === 0 && !focus">
      <div class="line"></div>
      <div class="set-address ml32 set-line2" v-for="(item,index) in historyList" :key="index" @click="handleindexRoute(item)">
        <img class="img" src="../../assets/images/time.png" alt="">
        <div class="middle">
          <span>{{item.placeNameStart}}</span>-<span>{{item.placeNameEnd}}</span>
        </div>
      </div>
      <div class="clear-data" @click="handleClear" seed="清空历史记录">
        清空历史记录
      </div>
    </div>
    <div class="records" v-if="historyRecord.length > 0 && (focus === 'start' || focus === 'end') && resultList.length === 0">
      <div class="line"></div>
      <div class="list"  v-for="(item,index) in historyRecord" :key="index" @click="handleHistory(item)" :seed="item.placeName">
        <img src="../../assets/images/time.png" alt="">
        <div class="content">
          <div>{{item.placeName}}</div>
          <div>{{item.description}}</div>
        </div>
      </div>
       <div class="clear-data" @click="handleGetclearHistory" seed="清空搜索记录">清空历史记录</div>
    </div>
    <div class="search-result" v-if="resultList.length > 0">
      <div class="title">
        <span>搜索结果</span>
      </div>
      <div class="list" v-for="(item,index) in resultList" :key="index" @click="handleResult(item)" :seed="item.name">
        <img src="../../assets/images/time.png" alt="">
        <div class="result">
          <div class="first-line">{{item.name}}</div>
          <div class="second-line">
            <div v-if="item.address && item.address.length === 0"></div>
            <div v-else>{{item.address}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="traffic-service" v-if="traffic.length>0 && focus !== 'start' && focus !== 'end'" >
        <div class="title">公交服务</div>
        <div class="content">
          <div class="kuang" v-for="(item,index) in traffic" :key="index" :class="{ mr91: index !== 3 && index !== 7}" @click="handleProgram(item.url_type,item.url_path,item.url_remark)" :seed="item.icon_name">
            <img :src="item.icon_img" alt="">
            <div>{{item.icon_name}}</div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";
import { templateId} from '../../config/index';
import { MessageBox } from 'mint-ui';
import { Toast } from 'mint-ui';

export default {
  data() {
    return {
      userId: this.$route.query.userId || sessionStorage.getItem("userId"),
      AMP_WEB_KEY: '5d1564203934a57a268d0ef563babc03',
      noValue: 'start',
      location: this.$route.query.location,
      startLocation:this.$route.query.startLocation,
      endLocation:this.$route.query.endLocation,
      name: this.$route.query.name,
      startText: this.$route.query.startName,
      endText: this.$route.query.endName,
      focus: '',
      positionIsShow: false,
      lng: '',
      lat: '',
      endLng: '',
      endLat: '',
      locationType: true,
      type: this.$route.query.type ,
      cityCode: '',
      historyList: [],
      historyRecord: [],
      resultList: [],
      editType: '',
      editId: 0,
      pageNum: 1,
      addressPageNum: 1,
      traffic: [
        {
          icon_img: '',
          icon_name: '',
          url_path: '',
          url_remark: '',
          url_type: ''
        },
      ],
    };
  },
  components: {},
  created() {},
  computed: {},
  methods: {
    async handleMyAddress() {
      if((!this.location || this.location === 'null') && !this.startLocation){
        this.getLongitude()
        return
      }else{
        if(this.focus === 'end' && this.startText === '我的位置'){
              Toast({
                  message: `起点与终点不能相同！`,
                  position: "middle",
                  duration: 1000
              });
              return
        }else if(this.focus === 'start' && this.endText === '我的位置'){
               Toast({
                  message: `起点与终点不能相同！`,
                  position: "middle",
                  duration: 1000
              });
              return
        }else{
            let router
            let startLocation
            let endLocation
            if(this.focus === 'start'){
                if(this.startLocation){
                  endLocation = `${this.endLng},${this.endLat}`;
                }else{
                  endLocation = `${this.lng},${this.lat}`;
                }
              startLocation = sessionStorage.getItem("location")
              if(this.startText !== '我的位置' && this.endText !== ''){
                if(!startLocation){
                    this.getLongitude()
                    return
                }
                 this.startText = '我的位置';
                 router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(this.startText)}&endLocation=${endLocation}&endName=${encodeURIComponent(this.endText)}`;
                 this.$router.push(router);
              }else{
                  this.startText = '我的位置';
              }
            }else{
              startLocation = `${this.lng},${this.lat}`;
              endLocation = sessionStorage.getItem("location")
              if(this.endText !== '我的位置' && this.startText !== ''){
                  if(!endLocation){
                    this.getLongitude()
                    return
                  }
                 this.endText = '我的位置';
                 router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(this.startText)}&endLocation=${endLocation}&endName=${encodeURIComponent(this.endText)}`;
                 this.$router.push(router);
              }else{
                this.endText = '我的位置';
              }
            }
        }
      }
    },
    startFocus(){
     this.positionIsShow = true;
     this.focus = 'start'
    },
    endFocus(){
     this.positionIsShow = true;
     this.focus = 'end'
   },
    handleMap() {
      let addressName;
      this.focus === 'start' ? addressName = this.startText : addressName = this.endText
      let router
      let location
      if(this.focus === 'start'){
         if(this.endText){
           if(this.location && this.location !== ','){
             location = this.location
           }else{
             location = `${this.lng},${this.lat}`
           }
            router = `/busMap?type=${this.focus}&location=${location}&addressName=${this.endText}&urlType=index`;
         }else{
            router = `/busMap?type=${this.focus}&urlType=index`;
         }
      }else if(this.focus === 'end'){
          if(this.startText){
            if(this.location && this.location !== ','){
             location = this.location
            }else{
             location = `${this.lng},${this.lat}`
            }
            router = `/busMap?type=${this.focus}&location=${location}&addressName=${this.startText}&urlType=index`;
         }else{
            router = `/busMap?type=${this.focus}&urlType=index`;
         }
      }
      this.$router.push(router);
    },
     getAddressList(address) {
       const data = {
        key: this.AMP_WEB_KEY,
        keywords: address,
        offset: 20,
        page: 1,
        city: sessionStorage.getItem("locationCity") || '杭州市',
        citylimit: true,
      };
      inquiryService.getAddressList2(data).then(
        response => {
          this.resultList = [];
          if(response.pois.length > 0){
              response.pois.forEach((item,index) => {
                    if(item.location){
                      this.resultList.push(item)
                    }
                })
          }
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    async handleHistory(value){
      let startLocation
      let endLocation
      if(this.focus === 'start'){
          startLocation = `${value.longitude},${value.latitude}`;
          this.startText = value.placeName;
          if(this.startLocation){
            endLocation = `${this.endLng},${this.endLat}`;
          }else{
            endLocation = `${this.lng},${this.lat}`;
          }
      }else{
        this.endText = value.placeName;
        endLocation = `${value.longitude},${value.latitude}`;
        startLocation = `${this.lng},${this.lat}`;
      }
      if(this.startText === this.endText){
          Toast({
          message: `起点与终点不能相同！`,
          position: "middle",
          duration: 1000
        });
        return
      }
      let data = {
          userId: this.userId,
          longitudeStart: startLocation.split(",")[0],
          latitudeStart: startLocation.split(",")[1],
          longitudeEnd: endLocation.split(",")[0],
          latitudeEnd: endLocation.split(",")[1],
          placeNameStart: this.startText,
          placeNameEnd: this.endText,
      };
      if(this.startText && this.endText){
        await this.addOrUpdateIndexPoints(data)
        const router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(this.startText)}&endLocation=${endLocation}&endName=${encodeURIComponent(this.endText)}`;
        this.$router.push(router);
      }else{
        this.lng = value.longitude;
        this.lat = value.latitude;
        this.resultList = [];
      }
    },
    async handleResult(value){
      await this.AddInsertHistory(value)
      let startLocation
      let endLocation
      if(this.focus === 'start'){
          startLocation = value.location;
          this.startText = value.name;
          if(this.startLocation){
            endLocation = `${this.endLng},${this.endLat}`;
          }else{
            endLocation = `${this.lng},${this.lat}`;
          }
      }else{
        this.endText = value.name;
        endLocation = value.location;
        startLocation = `${this.lng},${this.lat}`;
      }
      if(this.startText === this.endText){
          Toast({
          message: `起点与终点不能相同！`,
          position: "middle",
          duration: 1000
        });
        return
      }
      let data = {
          userId: this.userId,
          longitudeStart: startLocation.split(",")[0],
          latitudeStart: startLocation.split(",")[1],
          longitudeEnd: endLocation.split(",")[0],
          latitudeEnd: endLocation.split(",")[1],
          placeNameStart: this.startText,
          placeNameEnd: this.endText,
      };
      if(this.startText && this.endText){
        await this.addOrUpdateIndexPoints(data)
        const router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(this.startText)}&endLocation=${endLocation}&endName=${encodeURIComponent(this.endText)}`;
        this.$router.push(router);
      }else{
        this.lng = value.location.split(",")[0];
        this.lat = value.location.split(",")[1];
        this.resultList = [];
      }
    },
    handleQuery(content) {
      this.getAddressList(content);
    },
    handleProgram(type,url,remark){
      if(type === 'miniapp'){
        my.postMessage({method:"navigateToMiniProgram",param:{data:this.cityCode,appId:remark}})
      }else if(type=== 'h5Out'){
        my.postMessage({method:"h5Out",param:{"navigateOuter":"true","type":"h5Out","url":url,appId:remark}})
      }else{
        window.location.href= `${url}`
      }
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
              that.startText = '';
              that.focus = ''
              return;
            }
            if(that.lng && that.lat){
              const router = `/queryResult?startLocation=${that.lng},${that.lat}&startName=${encodeURIComponent(that.startText)}&endLocation=${result.longitude},${result.latitude}&endName=${encodeURIComponent(that.endText)}`;
              this.$router.push(router);
            }
            that.cityCode = result.cityAdcode;
            that.lng = result.longitude;
            that.lat = result.latitude;
            that.location = `${result.longitude},${result.latitude}`
            const location = `${that.lng},${that.lat}`
            const myAddress = `${result.streetNumber.street}${result.streetNumber.number}`
            sessionStorage.setItem("location", location);
            sessionStorage.setItem("myAddress", myAddress);
            sessionStorage.setItem("locationCity",result.city);
            sessionStorage.setItem("cityAdcode",result.cityAdcode);
          }
        );
      }
    },
    handleGetAddress(index){
      let router = '';
      if(index === this.noValue){
        let name = '';
        index === 'start' ? name = this.endText : name = this.startText;
          if(!this.locationType){
            this.lng = '';
            this.lat = '';
          }
        router = `/getAddress?type=${index}&location=${this.lng},${this.lat}&addressName=${name}&urlType=index`;
      }else{
        router = `/getAddress?type=${index}&urlType=index`;
      }
      this.$router.push(router);
    },
    handleChange() {
      if (this.noValue === "start") {
        this.noValue = 'end';
        this.endText = this.startText;
        this.startText = '';
      }else{
        this.noValue = 'start';
        this.startText = this.endText;
        this.endText = '';
      }

    },
    //清空历史记录
    handleClear(){
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
    handleGetclearHistory(){
       MessageBox.confirm("",{
	      title:'',
	      message:'清空历史记录？',
	      confirmButtonText:'立即清空',
        cancelButtonText:'取消',
        cancelButtonClass: 'cancleButton',
        confirmButtonClass: 'confirmButton'
        })
        .then(action => {
          this.getclearHistory();
        })
        .catch(() => {});
    },
    handleindexRoute(value){
     const startLocation = `${value.longitudeStart},${value.latitudeStart}`;
     const endLocation = `${value.longitudeEnd},${value.latitudeEnd}`;
     const router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(value.placeNameStart)}&endLocation=${endLocation}&endName=${encodeURIComponent(value.placeNameEnd)}`;
     this.$router.push(router);
    },
    //获取首页列表地址接口
    getIndexHistory(value) {
      const userId = this.userId || sessionStorage.getItem("userId")
      const data = {
          "pageNum": this.pageNum,
          "pageSize": 10,
          "userId": userId
      }
      return inquiryService.getIndexHistory(data).then(
        response => {
          this.pageNum = this.pageNum + 1;
          // this.historyList = response.data.records;
          response.data.records.forEach(item => {
            this.historyList.push(item)
          });
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
     getSearchHistory(value) {
      const data = {
        userId: this.userId,
        pageNum: this.addressPageNum,
        pageSize: 10,
      };
      return inquiryService.getSearchHistory(data).then(
        response => {
          this.pageNum = this.addressPageNum + 1;
          response.data.records.forEach((item,index) => {
            this.historyRecord.push(item)
          })
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //清空首页历史记录
    getClearIndex(value) {
      const userId = this.userId || sessionStorage.getItem("userId")
      const data = {
          "userId": userId
      }
      return inquiryService.getClearIndex(data).then(
        response => {
         this.historyList = [];
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
        //删除历史记录接口
    getclearHistory(value) {
      const data = {
        userId: this.userId || sessionStorage.getItem("userId"),
      };
      return inquiryService.getclearHistory(data).then(
        response => {
            this.historyRecord = [];
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
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
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
    //新增历史记录
    AddInsertHistory(value) {
      const data = {
        userId: this.userId,
        placeName: value.name,
        longitude: value.location.split(",")[0],
        latitude: value.location.split(",")[1],
        description: value.address,
      };
      return inquiryService.AddInsertHistory(data).then(
        response => {
           this.historyRecord = [];
           this.getSearchHistory()
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
  },
  mounted() {
   if(this.location){
     if(this.location === ','){
      this.getLongitude()
     }else{
      this.lng = this.location.split(",")[0]
      this.lat = this.location.split(",")[1]
     }
      if (this.type === "start") {
          this.startText = this.$route.query.name;
         } else if (this.type === "end") {
          this.endText = this.name;
          this.startText = "";
        }else{
          this.startText = '';
          this.endText = this.name;
        }
   }else{
    if(this.startLocation){
      this.lng = this.startLocation.split(",")[0];
      this.lat = this.startLocation.split(",")[1];
      this.endLng = this.endLocation.split(",")[0];
      this.endLat = this.endLocation.split(",")[1];
    }else{
      this.getLongitude()
    }
   }
   this.getIndexHistory();
   this.getSearchHistory()
   this.getIconList()
    const self = this;
    document.addEventListener("scroll", function() {
      const scrollTop = window.pageYOffset || document.body.scrollTop;
      if (
        document.body.scrollHeight == scrollTop + window.innerHeight &&
        self.historyList.length > 0
      ) {
        self.getIndexHistory();
      }
    });
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
input {
  outline-color: invert;
  outline-style: none;
  outline-width: 0;
  border: none;
  border-style: none;
  text-shadow: none;
  -webkit-appearance: none;
  -webkit-user-select: text;
  outline-color: transparent;
  box-shadow: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #7a869a;
  /* placeholder字体大小  */
  font-size: .373333rem /* 28/75 */;
}
.ml32{
    margin-left: .426667rem /* 32/75 */;
    margin-right: .426667rem /* 32/75 */
  }
  .mt200{
    margin-top: 2.986667rem /* 224/75 */;
  }
  .selectColor{
    color: #7A869A !important;
  }
.line-inquiry {
  background: #fff !important;
  overflow: hidden;
  position: relative;
  .search-header{
    position: fixed;
    width: 100%;
    background-color: #fff;
    z-index: 1000;
  }
  .search-header2{
    height:2.986667rem /* 224/75 */;
  }
  .position {
    width: 9.146667rem /* 686/75 */;
    height: 2.133333rem /* 160/75 */;
    background: rgba(244, 245, 247, 1);
    border-radius: 0.106667rem /* 8/75 */;
    margin: 0.426667rem /* 32/75 */ auto;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    -ms-align-items: center;
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
      font-size: .4rem /* 30/75 */;
      font-family: PingFangSC;
      .first-line {
        height: 1.066667rem /* 80/75 */;
        line-height: 1.066667rem /* 80/75 */;
        position: relative;
        width: 7.28rem /* 546/75 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        input{
          height: 1.066667rem /* 80/75 */;
          line-height: .666667rem /* 50/75 */;
          background: #f4f5f7;
          width: 100%;
          font-size: .426667rem /* 32/75 */
        }
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
        input{
          height: 1.066667rem /* 80/75 */;
          line-height: .666667rem /* 50/75 */;
          background: #f4f5f7;
          width: 100%;
          font-size: .426667rem /* 32/75 */;
        }
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
  .detail {
    width: 100%;
    height: 1.173333rem /* 88/75 */;
    display: flex;
    align-items: center;
    font-size: .4rem /* 30/75 */;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(9, 30, 66, 1);
    .left {
      width: 4.986667rem /* 374/75 */;
      display: flex;
      align-items: center;
      img {
        width: .64rem /* 48/75 */;
        height: .64rem /* 48/75 */;
        display: inline-block;
        margin-left: 1.386667rem /* 104/75 */;
      }
      span {
        margin-left: 0.133333rem /* 10/75 */;
      }
    }
    .right {
      width: 5rem /* 375/75 */;
      display: flex;
      align-items: center;
      img {
        width: .64rem /* 48/75 */;
        height: .64rem /* 48/75 */;
        display: inline-block;
        margin-left: 1.386667rem /* 104/75 */;
      }
      span {
        margin-left: 0.133333rem /* 10/75 */;
      }
    }
    .middle {
      width: 1px;
      height: 0.533333rem /* 40/75 */;
      background: rgba(216, 216, 216, 1);
    }
  }
  .line {
    height: 0.213333rem /* 16/75 */;
    width: 100%;
    background: rgba(244, 245, 247, 1);
  }
  .place {
    height: 0.586667rem /* 44/75 */;
    font-size: .4rem /* 30/75 */;
    font-family: PingFangSC;
    font-weight: 500;
    color: rgba(9, 30, 66, 1);
    line-height: 0.586667rem /* 44/75 */;
    margin: 0.426667rem /* 32/75 */ 0 0.213333rem /* 16/75 */ 0.426667rem
      /* 32/75 */;
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
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      height: 1.066667rem /* 80/75 */;
      align-items: center;
      -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
      font-size: .4rem /* 30/75 */;
      font-family:PingFangSC;
      position: relative;
      .img {
        width: .64rem /* 48/75 */;
        height: .64rem /* 48/75 */;
        margin-left: .32rem /* 24/75 */;
        display: inline-block;
      }
      .middle{
        margin-left: .106667rem /* 8/75 */;
        color:#091E42;
        min-width: .746667rem /* 56/75 */;
        max-width: 7.166667rem /* 560/75 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .right{
        margin-left: .586667rem /* 44/75 */;
        color:#7A869A;
        width: 6.133333rem /* 460/75 */;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .icon{
          width: .346667rem /* 26/75 */;
          height: .346667rem /* 26/75 */;
          position: absolute;
          right: .32rem /* 24/75 */;
          z-index: 99;
          top: 0;
          bottom: 0;
          margin: auto;
      }
      .word{
         color:#091E42;
         font-size: .4rem /* 30/75 */;
      }
    }
    .set-line{
      position: relative;
    }
    .set-line::after {
      content: "";
      height: 1px;
      background-color: #e8e8e8;
      position: absolute;
      left: 1.76rem /* 132/75 */;
      right: .853333rem /* 64/75 */;
      width: 6.533333rem /* 490/75 */;
      bottom: 0;
    }
    .set-line2{
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
}
.historyList{
  // height: 12.32rem /* 924/75 */;
  // overflow: auto;
}
 .clear-data {
    text-align: center;
    font-size: .4rem /* 30/75 */;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(122, 134, 154, 1);
    height: 1.44rem /* 108/75 */;
    line-height: 1.44rem /* 108/75 */;
  }
.records {
    .line {
      height: 0.213333rem /* 16/75 */;
      width: 100%;
      background: rgba(244, 245, 247, 1);
    }
    .list {
      display: flex;
      align-items: center;
      width: 100%;
      height: 1.44rem /* 108/75 */;
      font-size: .4rem /* 30/75 */;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(9, 30, 66, 1);
      position: relative;
      .content{
          margin-right: 0.133333rem /* 10/75 */;
          div:nth-child(1){
            width: 8.6rem /* 660/75 */;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          div:nth-child(2){
            font-size: .346667rem /* 26/75 */;
            color:rgba(122,134,154,1);
            width: 8.6rem /* 660/75 */;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      img {
        width: .64rem /* 48/75 */;
        height: .64rem /* 48/75 */;
        display: block;
        margin-left: 0.453333rem /* 34/75 */;
        margin-right: 0.24rem /* 18/75 */;
      }
    }
    .list::after {
      content: "";
      height: 1px;
      background-color: #e8e8e8;
      position: absolute;
      left: 0.453333rem /* 34/75 */;
      width: 9.093333rem /* 682/75 */;
      right: 0.453333rem /* 34/75 */;
      bottom: 0;
    }
  }
.search-result {
    font-family: PingFangSC;
    .title {
      width: 100%;
      height: 0.853333rem /* 64/75 */;
      line-height: 0.853333rem /* 64/75 */;
      background: rgba(244, 245, 247, 1);
      font-weight: 400;
      color: rgba(122, 134, 154, 1);
      font-size: .346667rem /* 26/75 */;
      span {
        margin-left: 0.426667rem /* 32/75 */;
      }
    }
    .list {
      height: 2.08rem /* 156/75 */;
      width: 100%;
      display: flex;
      position: relative;
      img {
        width: .64rem /* 48/75 */;
        height: .64rem /* 48/75 */;
        display: block;
        margin: 0.573333rem /* 43/75 */ 0.28rem /* 21/75 */ 0 0.48rem
          /* 36/75 */;
      }
      .result {
        font-family: PingFangSC;
        .first-line {
          font-weight: 400;
          color: rgba(9, 30, 66, 1);
          font-size: .4rem /* 30/75 */;
          margin-top: 0.426667rem /* 32/75 */;
        }
        .second-line {
          font-family: PingFangSC;
          font-weight: 400;
          color: rgba(122, 134, 154, 1);
          font-size: .346667rem /* 26/75 */;
          display: flex;
          margin-top: 0.106667rem /* 8/75 */;
          width: 9.013333rem /* 676/75 */;
          div:nth-child(1){
            width: 7.6rem /* 600/75 */;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          div:nth-child(2) {
            margin-left: auto;
            margin-right: 0.426667rem /* 32/75 */;
          }
        }
      }
    }
    .list::after {
      content: "";
      height: 1px;
      background-color: #e8e8e8;
      position: absolute;
      left: 0.453333rem /* 34/75 */;
      width: 9.093333rem /* 682/75 */;
      right: 0.453333rem /* 34/75 */;
      bottom: 0;
    }
  }
.traffic-service{
  .title{
    font-size:.373333rem /* 28/75 */;
    font-family:PingFangSC-Regular,PingFangSC;
    font-weight:400;
    color:rgba(122,134,154,1);
    line-height:.586667rem /* 44/75 */;
    height:.586667rem /* 44/75 */;
    padding-top:.213333rem /* 16/75 */;
    margin-left: .426667rem /* 32/75 */;
    margin-bottom: .4rem /* 30/75 */;
  }
  .content{
    margin-left: 0.72rem;
    .mr91{
      margin-right: 1.213333rem /* 91/75 */;
    }
    .kuang{
      font-size:.32rem /* 24/75 */;
      font-family:PingFangSC-Regular,PingFangSC;
      font-weight:400;
      color:rgba(9,30,66,1);
      line-height:.533333rem /* 40/75 */;
      width: 1.28rem /* 96/75 */;
      margin-bottom: .533333rem /* 40/75 */;
      float: left;
      img{
        width: 1.226667rem /* 92/75 */;
        height: 1.226667rem /* 92/75 */;
      }
    }
  }
}
// @import "index.styl";
</style>
