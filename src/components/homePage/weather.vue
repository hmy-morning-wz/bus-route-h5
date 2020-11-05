<template>
  <div class="weather" @touchstart="touchStart()" @touchend="touchEnd()">
    <div class="bg" @click="handleClick">
      <div class="content" :class="[animation === 1? 'moveRight':'moveLeft']">
        <div class="top">
          <div class="title">{{weather.city}}</div>
          <div class="temperature">
            <span>{{temperature}}°</span><span>{{weatherDetail.dayweather}}</span><span>{{weatherDetail.nighttemp}}°~{{weatherDetail.daytemp}}°</span>
          </div>
          <div class="comm-time">{{weatherDetail.date}}</div>
          <div class="comm-time">星期{{weatherDetail.week}}</div>
          <div class="comm-time">风力：{{weatherDetail.daypower}}</div>
          <div class="comm-time">湿度：{{humidity}}</div>
        </div>
        <div class="bottom">
          <div class="weather-icon" v-for="(item,index) in weather.casts.slice(0,2)" :key="index">
            <div class="ml40" v-if="index === 0">明天</div>
            <div class="ml40"v-else>后天</div>
            <img :src="item.dayimg" alt="">
            <div>{{item.nighttemp}}°~{{item.daytemp}}°</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import inquiryService from "../../service/index/inquiry.js";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import { getDirection } from "../../utils/move.js";

export default {
  props: ["animation", "weather","watherDay"],
  data() {
    return {
      userId: this.$route.query.userId,
      iSanimation: false,
      weatherDetail: "",
      humidity: "",
      temperature: "",
      startx: "",
      starty: "",
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
          img: '.https://images.allcitygo.com/snow.png',
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
  components: {},
  created() {},
  computed: {},
  methods: {
    getWeatherList() {
      const data = {
        webKey: '5d1564203934a57a268d0ef563babc03',
        cityd: this.cityCode || 330100,
        extensions: 'base',
      };
      inquiryService.getWeatherList(data).then(
        response => {

         console.log(response)
        },
        response => {
          console.log(response.Message || "服务器连接失败！");
        }
      );
    },
    touchStart(e) {
      this.startx = event.touches[0].pageX;
      this.starty = event.touches[0].pageY;
    },
    handleClick(){
      this.$emit("value-weather");
    },
    touchEnd(e) {
      let endx, endy;
      endx = event.changedTouches[0].pageX;
      endy = event.changedTouches[0].pageY;
      let direction = getDirection(this.startx, this.starty, endx, endy);
      switch (direction) {
        case 0:
          // alert("未滑动！");
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          // alert("向左！")
          break;
        case 4:
          this.$emit("value-weather");
          break;
        default:
      }
    }
  },
  mounted() {
    // this.iSanimation = true;
    this.weatherDetail = this.weather.casts[0];
    const myDate = new Date()
    this.weatherDetail.date = `${myDate.getFullYear()}年${(myDate.getMonth())+ 1}月${myDate.getDate()}日`
    switch (this.weatherDetail.week) {
      case "1":
        this.weatherDetail.week = "一";
        break;
      case "2":
        this.weatherDetail.week = "二";
        break;
      case "3":
        this.weatherDetail.week = "三";
        break;
      case "4":
        this.weatherDetail.week = "四";
        break;
      case "5":
        this.weatherDetail.week = "五";
        break;
      case "6":
        this.weatherDetail.week = "六";
        break;
      case "7":
        this.weatherDetail.week = "日";
        break;
      default:
        break;
    }
    this.humidity = this.watherDay[0].humidity;
    this.temperature = this.watherDay[0].temperature;
    this.weatherIcon.forEach((item,index) => {
        if(this.weather.casts[0].dayweather.indexOf(item.name) > -1){
            this.weather.casts[0].dayimg = item.img
        }
        if(this.weather.casts[1].dayweather.indexOf(item.name) > -1){
            this.weather.casts[1].dayimg = item.img
        }
    })
  },
  watch: {
    watherDay() {
      this.humidity = this.watherDay[0].humidity;
      this.temperature = this.watherDay[0].temperature;
    }
  }
};
</script>
<style>
</style>

<style lang="scss" scoped >
.ml40 {
  margin-left: 0.533333rem /* 40/75 */;
}
.weather {
  .bg {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 10rem /* 750/75 */;
    z-index: 1300;
    min-height: 17.786667rem /* 1334/75 */;
    background: rgba(0, 0, 0, 0.72);
  }
  .content {
    width: 10rem;
    // min-height: 17.786667rem /* 1334/75 */;
    height: 100%;
    background-color: #fff;
    margin-left: 3.333333rem /* 250/75 */;
    .top {
      width: 100%;
      height: 8.746667rem /* 656/75 */;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      .title {
        width: 10rem /* 750/75 */;
        height: 1.066667rem /* 80/75 */;
        line-height: 1.066667rem /* 80/75 */;
        background: rgba(244, 245, 247, 1);
        font-size: 0.426667rem /* 32/75 */;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(9, 30, 66, 1);
        padding-left: 0.333333rem /* 25/75 */;
      }
      .temperature {
        margin: 0.533333rem /* 40/75 */ 0 0.213333rem /* 16/75 */ 0.533333rem
          /* 40/75 */;
        font-size: 0.373333rem /* 28/75 */;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(9, 30, 66, 1);
        span:nth-child(1) {
          font-size: 0.853333rem /* 64/75 */;
          margin-right: 0.106667rem /* 8/75 */;
        }
        span:nth-child(2) {
          margin-right: 0.426667rem /* 32/75 */;
        }
      }
      .comm-time {
        font-size: 0.373333rem /* 28/75 */;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(122, 134, 154, 1);
        line-height: 0.586667rem /* 44/75 */;
        margin-left: 0.533333rem /* 40/75 */;
      }
    }
    .bottom {
      margin-top: 0.32rem /* 24/75 */;
      .weather-icon {
        display: flex;
        display: -webkit-flex;
        height: 1.28rem /* 96/75 */;
        align-items: center;
        font-size: 0.373333rem /* 28/75 */;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        color: rgba(122, 134, 154, 1);
        img {
          height: 0.64rem /* 48/75 */;
          width: 0.64rem /* 48/75 */;
          display: inline-block;
          margin-left: 1.066667rem /* 80/75 */;
          margin-right: 1.893333rem /* 142/75 */;
        }
      }
    }
  }
}
.moveLeft {
  animation: weatherChip1 0.4s ease-out 1;
  /* Safari 和 Chrome: */
  -webkit-animation: weatherChip1 0.4s ease-out 1;
}
@keyframes weatherChip1 {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(6.67rem, 0, 0);
  }
}

@-webkit-keyframes weatherChip1 /* Safari 和 Chrome */ {
  0% {
    -webkit-transform: translate3d(0, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(6.67rem, 0, 0);
  }
}
.moveRight {
  animation: weatherChip2 0.4s ease-out 1;
  /* Safari 和 Chrome: */
  -webkit-animation: weatherChip2 0.4s ease-out 1;
}
@keyframes weatherChip2 {
  0% {
    transform: translate3d(6.67rem, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@-webkit-keyframes weatherChip2 /* Safari 和 Chrome */ {
  0% {
    -webkit-transform: translate3d(6.67rem, 0, 0);
  }
  100% {
    -webkit-transform: translate3d(0, 0, 0);
  }
}
</style>
