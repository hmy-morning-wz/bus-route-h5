import Vue from 'vue';
import App from './App.vue';
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
// import VueAMap from 'vue-amap'
// 路由文件
import { router } from './router';
import AMap from 'vue-amap';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(AMap);
Vue.use(VueAxios, axios);
Vue.use(MintUI)
// 高德地图
AMap.initAMapApiLoader({
  // 高德的key
  key: '80087a0431514fc08f05b6fabad3c8d5',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  v: '1.4.4'
})
new Vue({
    router,
    el: '#app',
    components: { App },
    template: '<app></app>',
});
