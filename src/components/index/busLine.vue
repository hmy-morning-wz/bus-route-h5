<template>
  <div class="bus-line">
    <div id="container"></div>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      map: null,
      origin: this.$route.query.origin,
      destination: this.$route.query.destination,
    }
  },
  mounted () {
    document.querySelector('#container').style.height =  (window.screen.height) + 'px'
    const location = this.origin;
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 14, // 级别
      center: [location.split(',')[0], location.split(',')[1]] // 中心点坐标
    })
    this.setTransfer()
  },
  computed: {
  },
  methods: {
     setTransfer () {
       let transferOption = {
          map: this.map,
          nightflag: true, // 是否计算夜班车
          city: '杭州',
          outlineColor: '#ffeeee',
          autoFitView: true,
          policy: AMap.TransferPolicy.LEAST_TIME
      }
      let transfer =  new AMap.Transfer(transferOption)
      //根据起、终点坐标查询公交换乘路线
       transfer.search(new AMap.LngLat(this.origin.split(',')[0],this.origin.split(',')[1]),
       new AMap.LngLat(this.destination.split(',')[0],this.destination.split(',')[1]), (status, result) => {
        // result 即是对应的公交路线数据信息
        if (status === 'complete') {
            console.log('公交路线数据查询成功', result)
        } else {
            console.error('公交路线数据查询失败' + result)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#container{
  width: 100%;
}


</style>
