<template>
  <div class="line-inquiry">
    <div class="position">
      <div class="left"></div>
      <div class="middle">
        <div class="first-line"  @click="handleGetAddress('start')">{{startText}}</div>
        <div class="second-line" @click="handleGetAddress('end')">{{endText}}</div>
      </div>
      <div class="right" @click="handleChange"></div>
    </div>
    <div class="line"></div>
    <div class="route">
      <div class="strategy">
        <div class="content" :class="{blue_color: strategy === 0}" @click="handleWay(0)">
           推荐路线
           <div class="route-line" v-if="strategy === 0"></div>
        </div>
        <div class="content" :class="{blue_color: strategy === 3}" @click="handleWay(3)">
          少步行
          <div class="route-line" v-if="strategy === 3"></div>
        </div>
        <div class="content" :class="{blue_color: strategy === 2}" @click="handleWay(2)">
          少换乘
          <div class="route-line" v-if="strategy === 2"></div>
        </div>
      </div>
    </div>
    <div class="list" v-for="(item,index) in list" :key="index" @click="handleDetail(item,index)">
      <div class="first-line display">
        <div class="ml10 display" v-for="(items,index2) in item.title">
          {{items}}
          <img class="arrow" v-show="index2 != (item.title.length-1)" src="../../assets/images/arrow-route.png" alt="">
        </div>
      </div>
      <div class="second-line">
        <span>步行{{item.walking_distance}}米</span>
        <span>约{{Math.round(item.duration/60)}}分钟</span>
        <span v-if="item.cost && !Array.isArray(item.cost)">{{item.cost}}元</span>
      </div>
    </div>
    <div class="bottom-no-data" v-if="list.length <= 0">
      <img class="no-data" src="../../assets/images/no-data2.png" alt="">
      <div>暂无推荐路线</div>
      <div>你可以搜索线路、站点、地点</div>
    </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";
export default {
  data() {
    return {
      userId: sessionStorage.getItem("userId"),
      webKey: "5d1564203934a57a268d0ef563babc03",
      noValue: "end",
      startText:  this.$route.query.startName,
      endText: this.$route.query.endName,
      origin: this.$route.query.startLocation,
      destination: this.$route.query.endLocation,
      strategy: 0,
      list: [],
      nameArray: [],
    };
  },
  components: {},
  created() {},
  computed: {},
  methods: {
    handleGetAddress(value) {
      const router = `/index?startLocation=${this.origin}&startName=${this.startText}&endLocation=${this.destination}&endName=${this.endText}&type=${value}&urlType=queryResult`;
      this.$router.push(router);
    },
    handleWay(index){
      this.strategy = index;
      switch (this.strategy) {
       case 0:
          this.route = '推荐路线'
          break;
       case 2:
          this.route = '少换乘'
          break;
      case 3:
          this.route = '少步行'
          break;
        default:
          break;
      }
      this.getResult(index)
    },
    handleDetail(value,index){
      value.currentIndex = index;
      sessionStorage.setItem("content",JSON.stringify(value));
      const router = `/detail?origin=${this.origin}&startName=${this.startText}&destination=${this.destination}&endName=${this.endText}`;
      this.$router.push(router);
    },
    handleChange() {
      const text = this.endText;
      this.endText = this.startText;
      this.startText = text;
      const location = this.destination;
      this.destination = this.origin;
      this.origin = location;
      this.getResult();
    },
    getResult() {
      const data = {
        webKey: this.webKey,
        origin: this.origin,
        destination: this.destination,
        strategy: this.strategy,
        city: sessionStorage.getItem("locationCity") || '杭州',
        cityd: sessionStorage.getItem("cityAdcode") || 330100,
      };
      inquiryService.getResult(data).then(
        response => {
          if(response.route.transits){
            this.list = response.route.transits
            this.list.forEach((item,index) => {
                item.title = [];
                item.segments.forEach((item2) => {
                  if(item2.bus.buslines.length > 0){
                    item.title.push(item2.bus.buslines[0].name.split("(")[0])
                  }
                })
            })
            sessionStorage.setItem("list",JSON.stringify(this.list));
          }
        },
        response => {
          console.log(response.Message || "服务器连接失败！3");
        }
      );
    }
  },
  mounted() {
    this.getResult();
  },
  watch: {}
};
</script>
<style>
</style>

<style lang="scss" scoped >
.line-inquiry {
  .selectColor {
    color: #7a869a !important;
  }
  .blue_color {
    color: #1890ff;
  }
  .height400 {
    height: 5.333333rem /* 400/75 */;
  }
  .ml10{
    margin-left: .133333rem /* 10/75 */;
  }
  .arrow{
    height: .533333rem /* 40/75 */;
    width: .533333rem /* 40/75 */;
  }
  .display{
    display: flex;
    align-items: center;
  }
  background: #fff !important;
  overflow: hidden;
  .line-search {
    font-size: 0.4rem /* 30/75 */;
    font-family: PingFangSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    display: flex;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    align-items: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    -ms-align-items: center;
    margin: 0.266667rem /* 20/75 */ 0 0.64rem /* 48/75 */ 0;
    position: relative;
    div:nth-child(1) {
      margin-left: 0.36rem /* 27/75 */;
      margin-right: 0.16rem /* 12/75 */;
    }
    div:nth-child(2) {
      width: 9.066667rem /* 680/75 */;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    div:nth-child(3) {
      background: url("../../assets/images/search.png") no-repeat;
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
  .position {
    width: 9.146667rem /* 686/75 */;
    height: 2.133333rem /* 160/75 */;
    background: rgba(244, 245, 247, 1);
    border-radius: 0.106667rem /* 8/75 */;
    margin: 0.426667rem /* 32/75 */ auto;
    display: flex;
    display: -webkit-box;
    display: -moz-box;
    display: -webkit-flex;
    align-items: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
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
  .line {
    height: 0.213333rem /* 16/75 */;
    width: 100%;
    background: rgba(244, 245, 247, 1);
  }
  .route {
    position: relative;
  }
  .recommended-route {
    width: 10rem /* 750/75 */;
    height: 1.24rem /* 93/75 */;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    -webkit-justify-content: center;
    font-size: .4rem /* 30/75 */;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(9, 30, 66, 1);
    position: relative;
    img {
      width: 0.226667rem /* 17/75 */;
      height: 0.226667rem /* 17/75 */;
      display: block;
      margin-top: 0.106667rem /* 8/75 */;
      margin-left: 0.133333rem /* 10/75 */;
    }
  }
  .recommended-route::after {
    content: "";
    height: 1px;
    background-color: #e8e8e8;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
  }
  .strategy {
    font-size: 0.346667rem /* 26/75 */;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(122, 134, 154, 1);
    height: 1.226667rem /* 92/75 */;
    display: flex;
    background: #fff;
    position: relative;
    .content {
      height: 1.2rem /* 90/75 */;
      width: 3.333333rem /* 250/75 */;
      line-height: 1.2rem /* 90/75 */;
      text-align: center;
      position: relative;
        .route-line{
          position: absolute;
          height: .08rem /* 6/75 */;
          background-color: #1890ff;
          width: .746667rem /* 56/75 */;
          bottom: .253333rem /* 19/75 */;
          left: 0;
          right: 0;
          margin: auto;
      }
    }
  }
  .strategy:after {
      content: "";
      height: 1px;
      background-color: #e8e8e8;
      position: absolute;
      left: .426667rem /* 32/75 */;
      right: .426667rem /* 32/75 */;
      width: 9.146667rem /* 686/75 */;
      bottom: 0rem /* 16/75 */;
  }
  .list {
    width: 9.146667rem /* 686/75 */;
    height: 2.026667rem /* 152/75 */;
    margin-left: .426667rem /* 32/75 */;
    margin-right: .426667rem /* 32/75 */;
    position: relative;
    .first-line {
      font-size: .4rem /* 30/75 */;
      font-family: PingFangSC;
      font-weight: 600;
      color: rgba(9, 30, 66, 1);
      line-height: 0.533333rem; /* 40/75 */;
      padding-top: .426667rem /* 32/75 */;

    }
    .second-line {
      font-size: .346667rem /* 26/75 */;
      font-family: PingFangSC;
      font-weight: 400;
      color: rgba(122, 134, 154, 1);
      line-height: 0.533333rem; /* 40/75 */;
      margin-top: .053333rem /* 4/75 */;
    }
  }
   .list::after {
    content: "";
    height: 1px;
    background-color: #e8e8e8;
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0rem /* 16/75 */;
  }
  .bottom-no-data {
    width: 100%;
    height: 7rem /* 450/75 */;
    background: rgba(244, 245, 247, 1);
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(122, 134, 154, 1);
    text-align: center;
    .no-data {
      height: 3.84rem /* 288/75 */;
      width: 4.64rem /* 348/75 */;
      margin: 0 auto;
      display: block;
      padding-top: 1.173333rem /* 88/75 */;
    }
    div:nth-child(2) {
      margin-top: 0.533333rem /* 40/75 */;
      height: 0.586667rem /* 44/75 */;
      font-size: .4rem /* 30/75 */;
      line-height: 0.586667rem /* 44/75 */;
    }
  }
}

// @import "index.styl";
</style>
