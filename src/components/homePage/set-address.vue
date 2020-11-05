<template>
  <div class="set-address">
    <div class="title">
      <span>首页将展示4个常用地点，长按地点可调整排序</span>
    </div>
    <div class="address black_color" v-if="home" @click="handleOtherRoute(home)">
      <img class="left" src="../../assets/images/home.png" alt="">
      <div class="middle">{{home.placeName}}</div>
      <img @click="handleEdit(home.id,'home')" class="right" src="../../assets/images/edit.png" alt="">
    </div>
    <div class="address" v-else >
      <img class="left" src="../../assets/images/home.png" alt="" @click="handleEdit2(home,'home')">
      <div class="middle" @click="handleEdit2(home,'home')">添加地点</div>
      <img @click="handleEdit(home,'home')"  class="right" src="../../assets/images/edit.png" alt="">
    </div>
    <div class="address black_color" v-if="company" @click="handleOtherRoute(company)">
      <img class="left" src="../../assets/images/position.png" alt="">
      <div class="middle">{{company.placeName}}</div>
      <img @click="handleEdit(company.id,'company')" class="right" src="../../assets/images/edit.png" alt="">
    </div>
    <div class="address" v-else >
      <img @click="handleEdit2(company,'company')" class="left" src="../../assets/images/position.png" alt="">
      <div @click="handleEdit2(company,'company')" class="middle">添加地点</div>
      <img  @click="handleEdit(company,'company')"  class="right" src="../../assets/images/edit.png" alt="">
    </div>
      <draggable
        class="list-group"
        v-model="otherList"
        v-bind="dragOptions"
        @start="handleStart"
        @end="handleEnd"
      >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <div class="address black_color" v-for="(item,index) in otherList" :key="item.id" @click="handleOtherRoute(item)" @touchstart="start(index)" @touchend="end" :class="{dragging:selected === index}" >
            <img class="left" src="../../assets/images/place2.png" alt="">
            <div class="middle">{{item.placeName}}</div>
            <img class="right" @click="handleEdit(item.id,'other')" src="../../assets/images/edit.png" alt="">
        </div>
      </transition-group>
      </draggable>
    <div class="address" @click="handleSetAddress('other')" v-if="addIsShow || otherList.length < 10">
      <img class="left" src="../../assets/images/plus.png" alt="">
      <div class="middle">添加地点</div>
    </div>
    <div class="bg" v-show="editShow">
      <div class="edit-address">
        <div class="bottom-line" @click="handleSet('set')">
          重新设置地址
        </div>
        <div class="bottom-line" @click="handleSet('clear')" v-if="IsShowAddress">清空地址</div>
        <div class="bottom-line" @click="handleSet('cancel')">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";
import draggable from 'vuedraggable'
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      userId: sessionStorage.getItem("userId"),
      location: this.$route.query.location,
      addressName: this.$route.query.addressName,
      addIsShow: true,
      editShow: false,
      editId: '',
      editType: '',
      IsShowAddress: true,
      otherList: [],
      company: {},
      home: {},
      display: "Transitions",
      drag: false,
      selected: '',
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: true,
        ghostClass: "ghost"
      }
    };
  },
  mounted() {
    this.getCollectionPoints();
    const urlType = this.$route.query.urlType;
    this.$nextTick(() => {
      if(urlType === 'getAddress'){
        this.getLongitude()
      }
    });
  },
  computed: {
  },
  methods: {
    handleStart() {
      this.drag = false;
    },
    handleEnd() {
      this.drag = true;
      this.sortAdddress(this.otherList)
      this.dragOptions.disabled = true;
      this.selected = '';
    },
    start(index){
      clearTimeout(this.loop); //再次清空定时器，防止重复注册定时器
      this.loop = setTimeout(() => {
        this.dragOptions.disabled = false;
        this.selected = index
      }, 1000);
    },
    end(){
      clearTimeout(this.loop);
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
    //新增地址
    handleSetAddress(type) {
      if (this.otherList.length >= 10) {
        Toast({
          message: `最多添加10个地点！`,
          position: "middle",
          duration: 1000
        });
        setTimeout(() => {
          this.addIsShow = false;
        }, 1000);
        return;
      }
      const router = `/getAddress?type=${type}&urlType=setAddress`;
      this.$router.push(router);
    },
    handleOtherRoute(value){
      if(!this.dragOptions.disabled){
        return;
      }
      const endLocation = `${value.longitude},${value.latitude}`;
      const startLocation = this.location;
      const startName = this.addressName;
      const endName = this.$route.query.name;
      const currentLocation = sessionStorage.getItem("location")
      const currentName = sessionStorage.getItem("myAddress")
      let router;
      if(this.location === ',' || !this.location){
        router = `/index?userId=${this.userId}&type=end&name=${encodeURIComponent(value.placeName)}&location=${endLocation}`;
      }else{
        if(!startName){
          if(endName){
            if(currentLocation){
              router = `/queryResult?startLocation=${currentLocation}&startName=${encodeURIComponent(currentName)}&endLocation=${endLocation}&endName=${encodeURIComponent(endName)}`;
            }else{
              router = `/index?userId=${this.userId}&type=end&location=${endLocation}&name=${encodeURIComponent(endName)}`;
            }
          }else{
            router = `/index?userId=${this.userId}&type=end&name=${encodeURIComponent(value.placeName)}&location=${endLocation}`;
          }
        }else{
          if(startLocation === endLocation){
              router = `/queryResult?startLocation=${currentLocation}&startName=${encodeURIComponent(currentName)}&endLocation=${endLocation}&endName=${encodeURIComponent(value.placeName)}`;
          }else{
            router = `/queryResult?startLocation=${startLocation}&startName=${encodeURIComponent(startName)}&endLocation=${endLocation}&endName=${encodeURIComponent(value.placeName)}`;
          }
        }
      }
      this.$router.push(router);
    },
    handleEdit(id, type) {
      event.stopPropagation();
      this.editShow = true;
      this.editType = type;
      if(id)this.editId = id;
      if(id){
        this.editId = id;
        this.IsShowAddress = true;
      }else{
        this.IsShowAddress = false;
      }
    },
     handleEdit2(id, type) {
      const router = `/getAddress?type=${type}&urlType=setAddress`;
      this.$router.push(router);
    },
        //收藏地址设置
    handleSet(value) {
      if (value === "set") {
        const router = `/getAddress?type=${this.editType}&editId=${this.editId}&urlType=setAddress`;
        this.$router.push(router);
      } else if (value === "clear") {
        this.deleteCollectionPoints(this.editId);
      } else {
        this.editShow = false;
      }
    },
    //获取收藏地址列表接口
    getCollectionPoints(value) {
      const userId = this.userId || sessionStorage.getItem("userId");
      return inquiryService.getCollectionPoints(userId).then(
        response => {
          this.otherList = response.data.otherPoints;
          this.company = response.data.company;
          this.home = response.data.home;
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
          this.editId = '';
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
    //地址拖动接口
    sortAdddress(data) {
      return inquiryService.sortAdddress(data).then(
        response => {

        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    },
  },
  components: {
    draggable
 },
  watch: {}
};
</script>
<style lang="scss" scoped>
* {
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
  }
.set-address {
    .black_color{
        color:#253858 !important;
    }
    .dragging {
       background:rgba(255,255,255,1);
       box-shadow: 0px -3px 10px 0px rgba(0,0,0,0.1) inset,
       0px 3px 10px 0px rgba(0,0,0,0.1) inset !important;
    }
  .title {
    height: 1.333333rem /* 100/75 */;
    line-height: 1.333333rem /* 100/75 */;
    font-size: 0.373333rem /* 28/75 */;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(122, 134, 154, 1);
    span {
      margin-left: 0.426667rem /* 32/75 */;
    }
  }
  .address {
    position: relative;
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(122, 134, 154, 1);
    font-size: 0.373333rem /* 28/75 */;
    width: 100%;
    height: 1.6rem /* 120/75 */;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 1px 0 rgba(0,0,0,0.3);
    .left {
      height: 0.64rem /* 48/75 */;
      width: 0.64rem /* 48/75 */;
      margin-left: 0.426667rem /* 32/75 */;
    }
    .middle {
      margin-left: 0.106667rem /* 8/75 */;
      width: 6.666667rem /* 500/75 */;
      // line-height: 1.6rem;
    }
    .right {
      margin-left: auto;
      margin-right: 0.426667rem /* 32/75 */;
    }
  }
  // .address::after {
  //   content: "";
  //   height: 1px;
  //   background-color: #e8e8e8;
  //   position: absolute;
  //   left: 0;
  //   width: 100%;
  //   bottom: 0;
  // }
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
    .arrow {
      height: 4.44rem /* 333/75 */;
      width: 0.893333rem /* 67/75 */;
      margin: 8.293333rem /* 622/75 */ auto 0;
      display: block;
    }
    .more {
      width: 4.266667rem /* 320/75 */;
      height: 1.173333rem /* 88/75 */;
      line-height: 1.173333rem /* 88/75 */;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 0.213333rem /* 16/75 */;
      font-size: 0.426667rem /* 32/75 */;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      margin: 0 auto;
    }
  }
}
</style>
