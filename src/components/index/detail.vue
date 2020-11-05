<template>
  <div class="transfer-detail">
    <!-- <div class="line-search">
      <div></div>
      <div>换乘详情</div>
      <div @click="handleMap" seed="地图公交规划"></div>
    </div> -->
    <div class="swiper-container" style="padding-top:20px;">
      <div class="swiper-wrapper">
        <div class="header mb8 swiper-slide" v-for="(item,index) in list" :key="index">
          <div class="first-line">
            <div class="left dispaly">
              <div class="dispaly" v-for="(item2,index2) in item.title">{{item2}}
              <img class="arrow" v-show="index2 != (item.title.length-1)" src="../../assets/images/arrow-route.png" alt="">
              </div>
            </div>
          </div>
          <div class="second-line">
            <span>步行{{item.walking_distance}}米</span>
            <span>约{{Math.round(item.duration/60)}}分钟</span>
            <span>{{Math.round(item.cost)}}元</span>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <div class="line"></div>
    <div class="traffic-mode" v-for="(item,index) in trafficRoutes" :key="index">
      <div class="both-ends" v-if="item.walking.distance && (item.via_stops.length > 0 || item.departure_stop)">
        <img class="walk-icon" src="../../assets/images/walk.png" alt="">
        <img class="middle" src="../../assets/images/start-icon.png" alt="" v-if="index === 0">
        <img class="middle2" src="../../assets/images/icon3.png" alt="" v-else>
        <div class="right">
          <div class="first-line" v-if="index === 0">{{startName}}</div>
          <div class="second-line">步行{{item.walking.distance}}米 约<span v-if="item.walking.duration < 60">1</span><span v-else>{{Math.round(item.walking.duration/60)}}</span>分钟</div>
        </div>
      </div>
      <div class="bus" :ref="'bus'+index" :id="'bus'+ index" v-if="item.via_stops.length > 0 || item.departure_stop">
        <img class="bus-icon" src="../../assets/images/bus.png" alt="">
        <div class="distance-bar">
          <div class="bar"  :id="'bar'+ index" >
            <div class="circle top"></div>
            <div class="circle bottom"></div>
          </div>
        </div>
        <div class="right">
            <div class="site mt8">{{item.departure_stop}}
              <span v-if="item.entrance && item.entrance.length !== 0">({{item.entrance.name}})</span>
              </div>
            <div class="line">
              <div><span>{{item.name}}</span></div>
              <div>{{item.title}}</div>
            </div>
            <div class="site-number" @click="handleUp(index)" v-if="item.isShow" >
              <span class="color-blue">{{item.via_stops.length + 1}}站</span>
              <span class="color-black">({{Math.round(item.duration)}}分钟)</span>
              <img src="../../assets/images/icon_up.png" alt="" >
            </div>
            <div class="site-number" @click="handleDown(index)" v-else>
              <span class="color-blue">{{item.via_stops.length + 1}}站</span>
              <span class="color-black">({{Math.round(item.duration)}}分钟)</span>
              <img src="../../assets/images/icon_down.png" alt="">
            </div>
            <div class="site-name" v-show="item.isShow" v-for="(item2,index2) in item.via_stops" :key="index2">
                <div ref="site">{{item2.name}}</div>
            </div>
            <div class="site mb8">{{item.arrival_stop}}<span v-if="item.exit && item.exit.name">({{item.exit.name}})</span></div>
        </div>
      </div>
      <div class="both-ends dispaly" v-if="(trafficRoutes.length -1) == index">
        <img class="walk-icon" src="../../assets/images/walk.png" alt="">
          <img class="middle" src="../../assets/images/end-icon.png" alt="">
        <div class="right">
          <div class="second-line">步行{{item.walking.distance}}米 约<span v-if="item.walking.duration < 60">1</span><span v-else>{{Math.round(item.walking.duration/60)}}</span>分钟</div>
          <div class="first-line mt8 mb8">{{endName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";

export default {
  data() {
    return {
      origin: this.$route.query.origin,
      destination: this.$route.query.destination,
      startName: this.$route.query.startName,
      endName: this.$route.query.endName,
      type: false,
      routeIndex: '',
      isShow: '',
      content:JSON.parse(sessionStorage.getItem("content")),
      list: JSON.parse(sessionStorage.getItem("list")),
      trafficRoutes: '',
      startHeight: '',
      contentStyleObj: {
        height: ''
      },
    };
  },
  components: {},
  created() {},
  computed: {},
  methods: {
    handleMap(){
      const router = `/busLine?origin=${this.origin}&destination=${this.destination}`;
      this.$router.replace(router);
    },
    handleDown(value){
      this.trafficRoutes.forEach((item, index) => {
          if(index === value){
            item.isShow = true;
          }
      })
      this.$nextTick(() => {
        this.contentStyleObj.height = (document.querySelector(`#bus${value}`).offsetHeight - 26) + 'px';
        document.querySelector(`#bar${value}`).style.height =  this.contentStyleObj.height;
      });
    },
    handleUp(value){
      this.trafficRoutes.forEach((item, index) => {
          if(value === index){
            item.isShow = false;
          }
      })
      this.$nextTick(() => {
        document.querySelector(`#bar${value}`).style.height = this.startHeight;
      });
    },
    parameter(){
      this.list.forEach((item,index) => {
         if(index === this.content.currentIndex){
          const array = item.segments
           array.forEach((item2,index2) => {
              item2.isShow = false;
              item2.via_stops = [];
            if(item2.bus.buslines.length > 0){
                item2.departure_stop = item2.bus.buslines[0].departure_stop.name;
                item2.duration = (item2.bus.buslines[0].duration/60);
                item2.arrival_stop =  item2.bus.buslines[0].arrival_stop.name;
                item2.via_stops = item2.bus.buslines[0].via_stops;
                item2.name = item2.bus.buslines[0].name.split("(")[0];
                item2.title = item2.bus.buslines[0].name.split("(")[1].split(")")[0];
            }
           })
            this.trafficRoutes = JSON.parse(JSON.stringify(array))
         }
      })
    },
  },
  mounted() {
    const that = this;
    this.parameter();
    const swiper = new Swiper('.swiper-container', {
      initialSlide : this.content.currentIndex,
      pagination: {
        el: '.swiper-pagination',
      },
        on: {
        slideChangeTransitionEnd: function(){
          that.content.currentIndex = this.activeIndex
          that.parameter();
          const array =   that.trafficRoutes.slice(0,that.trafficRoutes.length-1)
           array.forEach((item,index) => {
            that.$nextTick(() => {
                document.querySelector(`#bar${index}`).style.height = `2.27rem`;
            });
           })
    },
  },
    });
  },
  watch: {
  }
};
</script>
<style>
</style>

<style lang="scss" scoped >
.mt6 {
  margin-top: 0.08rem /* 6/75 */;
}
.mt8{
  margin-top: .106667rem /* 8/75 */;
}
.mb8{
  margin-bottom: .106667rem /* 8/75 */;
}
.mt188{
  margin-top: 2.373333rem /* 178/75 */;
}
.mt20{
  margin-top: .266667rem /* 20/75 */;
}
.mt38{
  margin-top: .506667rem /* 38/75 */;
}
.arrow{
    height: .533333rem /* 40/75 */;
    width: .533333rem /* 40/75 */;
  }
.dispaly{
  display: flex;
  align-items: center;

}
.swiper-container{
  height: 2.773333rem /* 208/75 */;
}
.transfer-detail {
  background: #fff !important;
  overflow: hidden;

  .line-search {
    font-size: 0.506667rem /* 38/75 */;
    font-family: PingFangSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    display: flex;
    display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
    align-items: center;
         -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
    margin: 0.266667rem /* 20/75 */ 0 0.64rem /* 48/75 */ 0;
    position: relative;
    div:nth-child(1) {
      margin-left: 0.36rem /* 27/75 */;
      margin-right: 0.16rem /* 12/75 */;
    }
    div:nth-child(3) {
      background: url("../../assets/images/place.png") no-repeat;
      background-size: 100% 100%;
      width: 0.64rem /* 48/75 */;
      height: 0.64rem /* 48/75 */;
      margin-left: auto;
      margin-right: 0.426667rem /* 32/75 */;
    }
  }
  .line-search::after {
    content: "";
    height: 1px;
    background-color: #e8e8e8;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: -0.213333rem /* 16/75 */;
  }
  .header {
    height: 2.773333rem /* 208/75 */;
    .first-line {
      height: 0.586667rem /* 44/75 */;
      font-size: .4rem /* 30/75 */;
      font-family: PingFangSC;
      font-weight: 500;
      color: rgba(9, 30, 66, 1);
      line-height: 0.586667rem /* 44/75 */;
      width: 9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      .left {
        margin-left: 0.426667rem /* 32/75 */;
      }
      .right {
        width: 1.066667rem /* 80/75 */;
        height: 0.533333rem /* 40/75 */;
        line-height: 0.533333rem /* 40/75 */;
        background: rgba(25, 145, 235, 1);
        border-radius: 0.266667rem /* 20/75 */;
        text-align: center;
        font-size: .346667rem /* 26/75 */;
        font-family: PingFangSC;
        font-weight: 400;
        margin-left: 0.213333rem /* 16/75 */;
        color: rgb(27, 6, 6);
      }
    }
    .second-line {
      height: 0.533333rem /* 40/75 */;
      font-size: .346667rem /* 26/75 */;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(122, 134, 154, 1);
      line-height: 0.533333rem /* 40/75 */;
      margin: 0.053333rem /* 4/75 */ 0.133333rem /* 10/75 */ 0 0.426667rem
        /* 32/75 */;
    }
  }
  .line {
    height: 0.213333rem /* 16/75 */;
    width: 100%;
    background: rgba(244, 245, 247, 1);
  }
  .traffic-mode {
    .both-ends {
      display: flex;
      display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      .walk-icon {
        width: 0.586667rem /* 44/75 */;
        height: 0.586667rem /* 44/75 */;
        display: block;
        margin: .533333rem /* 40/75 */ 0.16rem /* 12/75 */ 0.28rem /* 21/75 */
          0.426667rem /* 32/75 */;
      }
      .middle {
        width: 0.213333rem /* 16/75 */;
        height: 1.226667rem /* 92/75 */;
        margin-top: .2rem /* 15/75 */;
        margin-bottom: .2rem /* 15/75 */;
        display: block;
      }
      .middle2 {
        width: .08rem /* 6/75 */;
        height: .88rem /* 66/75 */;
        margin-top: .2rem /* 15/75 */;
        margin-bottom: .186667rem /* 14/75 */;
        display: block;
      }
      .right {
        margin: 0.32rem /* 24/75 */ 0 0 0.213333rem /* 16/75 */;
        font-family: PingFangSC;
        .first-line {
          height: 0.586667rem /* 44/75 */;
          line-height: 0.586667rem /* 44/75 */;
          font-size: .4rem /* 30/75 */;
          font-weight: 500;
          color: rgba(9, 30, 66, 1);
          width: 8rem /* 600/75 */;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .second-line {
          margin-top: 0.106667rem /* 8/75 */;
          font-weight: 400;
          color: rgba(122, 134, 154, 1);
          line-height: 0.533333rem /* 40/75 */;
          height: 0.533333rem /* 40/75 */;
          font-size: .346667rem /* 26/75 */;
          width: 8rem /* 600/75 */;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .bus {
      display: flex;
           display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
      align-items: center;
           -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
      background: rgba(245, 252, 255, 1);
      .bus-icon {
        width: 0.586667rem /* 44/75 */;
        height: 0.586667rem /* 44/75 */;
        margin-left: 0.426667rem /* 32/75 */;
        margin-right: 0.213333rem /* 16/75 */;
      }
      .distance-bar {
        // margin: .346667rem /* 26/75 */ 0;
        .circle {
          width: .106667rem /* 8/75 */;
          height: .106667rem /* 8/75 */;
          border-radius: .106667rem /* 8/75 */;
          background: rgba(255, 255, 255, 1);
        }
        .bar {
          width: 0.106667rem /* 8/75 */;
          height: 2.27rem;
          background: rgba(25, 145, 235, 1);
          border-radius: 0.053333rem /* 4/75 */;
          position: relative;
          overflow: hidden;
          .top {
            margin: auto;
            position: absolute;
            top: 0;
            left: 0;
          }
          .bottom {
            bottom: 0;
            position: absolute;
            left: 0;
          }
        }
      }
      .right{
        font-family:PingFangSC;
        margin-left: .266667rem /* 20/75 */;
        .site{
          height:.586667rem /* 44/75 */;
          font-size: .4rem /* 30/75 */;
          font-family:PingFangSC;
          font-weight:500;
          color:rgba(9,30,66,1);
          line-height:.586667rem /* 44/75 */;
        }
        .line{
          display: flex;
               display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
          align-items: center;
               -webkit-box-align: center;
        /* 12版 */
        -webkit-align-items: center;
        -moz-align-items: center;
        -ms-align-items: center;
          height:.533333rem /* 40/75 */;
          font-family:PingFangSC;
          margin-top: .213333rem /* 16/75 */;
          div:nth-child(1){
            width:1.84rem /* 138/75 */;
            height:.533333rem /* 40/75 */;
            line-height:.533333rem /* 40/75 */;
            background:rgba(25,145,235,1);
            border-radius:.266667rem /* 20/75 */;
            font-weight:400;
            color:rgba(255,255,255,1);
            text-align: center;
          }
          div:nth-child(2){
            font-size: .346667rem /* 26/75 */;
            font-weight:400;
            color:rgba(122,134,154,1);
            margin-left: .266667rem /* 20/75 */;
          }
        }
        .site-number{
          margin-top: .426667rem /* 32/75 */;
          font-size: .346667rem /* 26/75 */;
          font-family:PingFangSC;
          font-weight:400;
          height: .533333rem /* 40/75 */;
          img{
            width:.226667rem /* 17/75 */;
            height: .12rem /* 9/75 */;
          }
          .color-blue{
            color:rgba(25,145,235,1);
          }
          .color-black{
            color:rgba(122,134,154,1);
          }
        }
        .site-name{
          display: flex;
               display: -webkit-box;
      display: -moz-box;
      display: -webkit-flex;
          margin-top: .133333rem /* 10/75 */;
          height: .48rem /* 36/75 */;
          line-height: .48rem /* 36/75 */;
          div:nth-child(1){
            font-size: .346667rem /* 26/75 */;
          }
           div:nth-child(2){
              font-size:  .346667rem /* 26/75 */;
              color:#7A869A;
          }
        }
      }
    }
  }
}
// @import "detail.styl";
</style>
