<template>
  <div class="line-inquiry">
    <div class="search-header">
      <div class="search" style="padding-top:10px">
        <div class="left"><input v-model="address"  placeholder="搜索公交路线/车站/地点" @input="handleQuery"></div>
        <div class="right" @click="handleCancel">取消</div>
      </div>
      <div class="detail">
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
    </div>
    <div class="search-header2"></div>
    <div class="bottom-no-data" v-if="historyRecord.length === 0 && resultList.length === 0">
      <img class="no-data" src="../../assets/images/no-data.png" alt="">
      <div>暂无历史记录</div>
      <div>你可以搜索线路、站点、地点</div>
    </div>
    <div class="records" v-if="historyRecord.length > 0 && resultList.length === 0">
      <div class="line"></div>
      <div class="list"  v-for="(item,index) in historyRecord" :key="index" @click="handleHistory(item)" :seed="item.placeName">
        <img src="../../assets/images/time.png" alt="">
        <div class="content">
          <div>{{item.placeName}}</div>
          <div>{{item.description}}</div>
        </div>
      </div>
       <div class="clear-data" @click="handleClear" seed="清空搜索记录">清空历史记录</div>
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
            <!-- <div>{{item.distance}}m</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";
import { MessageBox } from 'mint-ui';
import { Toast } from "mint-ui";

export default {
  data() {
    return {
      userId: sessionStorage.getItem("userId") || this.$route.query.userId,
      address: "",
      webKey: "5d1564203934a57a268d0ef563babc03",
      location: this.$route.query.location,
      addressName: this.$route.query.addressName,
      editId: this.$route.query.editId,
      pageNum: 1,
      cityCode: 330100,
      resultList: [],
      historyRecord: [],
      urlType: this.$route.query.urlType,
    };
  },
  components: {},
  created() {
    // console.log("url--info",this.$route.path);
  },
  computed: {},
  methods: {
    handleClear() {
      MessageBox({
      title: '提示',
      message: '确定执行此操作?',
        showCancelButton: true
      });
      MessageBox.confirm('确定执行此操作?').then(action => {
         this.getclearHistory();
      });
    },
    handleCancel() {
      history.back();
    },
    handleQuery() {
      this.getAddressList();
    },
    async handleMyAddress() {
      let router;
      const startLocation = sessionStorage.getItem("location");
      if(!startLocation){
        Toast({
            message: `请允许获取你的定位信息！`,
            position: "middle",
            duration: 1500
        });
        return;
      }
      if(this.location && this.addressName !== '我的位置'){
        if(this.$route.query.type === 'start'){
          router = `/queryResult?startLocation=${startLocation}&startName=我的位置&endLocation=${this.location}&endName=${this.addressName}`;
        }else{
          router = `/queryResult?startLocation=${this.location}&startName=${this.addressName}&endLocation=${startLocation}&endName=我的位置`;
        }
      }else{
        if(this.$route.query.type !== 'start' && this.$route.query.type !== 'end' ){
          if(!startLocation){
            router = `/${this.urlType}?type=${this.$route.query.type}`;
            this.$router.replace(router);
          }else{
            const param = {
              longitude: startLocation.split(",")[0],
              latitude: startLocation.split(",")[1],
              placeName: sessionStorage.getItem("myAddress") || "西湖断桥残雪",
            }
            await this.addCollectionPoints(param)
          }
        }
        if(this.urlType === 'setAddress'){
          const str = 'getAddress'
          router = `/setAddress?type=${this.$route.query.type}&urlType=${str}`;
          this.$router.push(router);
        }else{
          router = `/${this.urlType}?type=${this.$route.query.type}`;
        }
      }
      this.$router.replace(router);
    },
    handleMap() {
      let router
      if(this.$route.query.location){
        router = `/busMap?type=${this.$route.query.type}&location=${this.$route.query.location}&addressName=${this.$route.query.addressName}`;
      }else{
        if(this.editId){
           router = `/busMap?type=${this.$route.query.type}&editId=${this.$route.query.editId}`;
        }else{
           router = `/busMap?type=${this.$route.query.type}`;
        }
      }
      this.$router.replace(router);
    },
    //点击搜索结果列表页跳转
    async handleResult(index){
      await this.AddInsertHistory(index)
       if(this.$route.query.type !== 'start' && this.$route.query.type !== 'end'){
         const param = {
            longitude: index.location.split(",")[0],
            latitude: index.location.split(",")[1],
            placeName: index.name,
         }
        await this.addCollectionPoints(param)
      }
      let router;
      if(this.location && this.location !== index.location){
        let data = {
          userId: this.userId,
          longitudeStart: index.location.split(",")[0],
          latitudeStart: index.location.split(",")[1],
          longitudeEnd: this.location.split(",")[0],
          latitudeEnd: this.location.split(",")[1],
          placeNameStart: index.name,
          placeNameEnd: this.addressName,
      };
      if(this.$route.query.type === 'end'){
          if(this.location === ','){
            router = `/${this.urlType}?location=${index.location}&name=${index.name}&type=${this.$route.query.type}`;
            this.$router.replace(router);
            return
          }
          data.longitudeStart = this.location.split(",")[0];
          data.latitudeStart = this.location.split(",")[1];
          data.placeNameStart = this.addressName;
          data.longitudeEnd = index.location.split(",")[0]
          data.latitudeEnd = index.location.split(",")[1]
          data.placeNameEnd = index.name
        }
        await this.addOrUpdateIndexPoints(data)
        if(this.$route.query.type === 'end'){
          router = `/queryResult?startLocation=${this.location}&startName=${this.addressName}&endLocation=${index.location}&endName=${index.name}`;
        }else{
          router = `/queryResult?startLocation=${index.location}&startName=${index.name}&endLocation=${this.location}&endName=${this.addressName}`;
        }
      }else{
        router = `/${this.urlType}?location=${index.location}&name=${index.name}&type=${this.$route.query.type}`;
      }
      this.$router.replace(router);
    },
    async handleHistory(value){
      if(this.$route.query.type !== 'start' && this.$route.query.type !== 'end'){
        await this.addCollectionPoints(value)
      }
      const location = `${value.longitude},${value.latitude}`
      let router;
      if(this.location && this.location !== location){
        let data = {
          userId: this.userId,
          longitudeStart: value.longitude,
          latitudeStart: value.latitude,
          longitudeEnd: this.location.split(",")[0],
          latitudeEnd: this.location.split(",")[1],
          placeNameStart: value.placeName,
          placeNameEnd: this.addressName,
      };
        if(this.$route.query.type === 'end'){
          if(this.location === ','){
            router = `/${this.urlType}?location=${location}&name=${value.placeName}&type=${this.$route.query.type}`;
            this.$router.replace(router);
            return
          }
          data.longitudeStart = this.location.split(",")[0];
          data.latitudeStart = this.location.split(",")[1];
          data.placeNameStart = this.addressName;
          data.longitudeEnd = value.longitude
          data.latitudeEnd = value.latitude
          data.placeNameEnd = value.placeName
        }
        await this.addOrUpdateIndexPoints(data)
        if(this.$route.query.type === 'end'){
          router = `/queryResult?startLocation=${this.location}&startName=${this.addressName}&endLocation=${location}&endName=${value.placeName}`;
        }else{
          router = `/queryResult?startLocation=${location}&startName=${value.placeName}&endLocation=${this.location}&endName=${this.addressName}`;
        }
      }else{
        console.log(this.location,location)
        console.log(this.location == location)
        if(this.location === location){
            Toast({
              message: `终点位置和起点位置不能相同！`,
              position: "middle",
              duration: 1500
          });
          return;
        }else{
          router = `/${this.urlType}?location=${location}&name=${value.placeName}&type=${this.$route.query.type}`;
        }
      }
      this.$router.replace(router);
    },
    getAddressList() {
      // const data = {
      //   webKey: this.webKey,
      //   address: this.address,
      //   location: this.location,
      //   city: sessionStorage.getItem("locationCity") || '',
      // };
       const data = {
        key: this.webKey,
        keywords: this.address,
        offset: 20,
        page: 1,
        city: sessionStorage.getItem("locationCity") || '杭州市',
        citylimit: true,
      };
      // if(sessionStorage.getItem("locationCity") ){
      //   data.citylimit = true
      // }else{
      //   data.citylimit = false
      // }
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
    getDistance(array){
      let origins = ''
      array.forEach((item,index) => {
          origins +=item + "|"
      })
      const data = {
        webKey: this.webKey,
        origins: origins,
        destination: sessionStorage.getItem("location"),
      };
      inquiryService.getDistance(data).then(
        response => {
          if(Array.isArray(response.results)){
            this.resultList.forEach((item,index) => {
              response.results.forEach((items,indexs) => {
                  item.distance = items.distance;
              })
          })
         }
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
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

        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //获取历史记录接口
    getSearchHistory(value) {
      const data = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: 10,
      };
      return inquiryService.getSearchHistory(data).then(
        response => {
          this.pageNum = this.pageNum + 1;
          response.data.records.forEach((item,index) => {
            this.historyRecord.push(item)
          })
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //删除历史记录接口
    getclearHistory(value) {
      const data = {
        userId: this.userId,
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
    //新增收藏地址接口
    addCollectionPoints(value) {
      let data = {
        userId: this.userId,
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
  },
  mounted() {
    this.getSearchHistory()
    const self = this;
    document.addEventListener("scroll", function() {
      const scrollTop = window.pageYOffset || document.body.scrollTop;
      if (
        document.body.scrollHeight == scrollTop + window.innerHeight && self.historyRecord.length > 0
      ) {
        self.getSearchHistory();
      }
    });
  },
  watch: {}
};
</script>
<style>
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
.clear-data {
  text-align: center;
  font-size: .4rem /* 30/75 */;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(122, 134, 154, 1);
  height: 1.44rem /* 108/75 */;
  line-height: 1.44rem /* 108/75 */;
}
@import "getAddress.styl";
</style>
