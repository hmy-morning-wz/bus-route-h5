import Vue from 'vue';
import VueRouter from 'vue-router';

const appMain = (resolve) => {
    require(['../components/home.vue'], resolve);
};
// 异步加载组件
const index = (resolve) => {
    require(['../components/index/index.vue'], resolve);
};
const getAddress = (resolve) => {
  require(['../components/index/getAddress.vue'], resolve);
};
const queryResult = (resolve) => {
  require(['../components/index/queryResult.vue'], resolve);
};
const detail = (resolve) => {
  require(['../components/index/detail.vue'], resolve);
};
const busLine = (resolve) => {
  require(['../components/index/busLine.vue'], resolve);
};
const busMap = (resolve) => {
  require(['../components/index/busMap.vue'], resolve);
};
const map = (resolve) => {
  require(['../components/index/map.vue'], resolve);
};
const homePage = (resolve) => {
  require(['../components/homePage/homePage.vue'], resolve);
};
const test = (resolve) => {
  require(['../components/homePage/test.vue'], resolve);
};
const setAddress = (resolve) => {
  require(['../components/homePage/set-address.vue'], resolve);
};
const routes = [
    {
        path: '/',
        component: appMain,
        meta: {
            title: '首页',
        },
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: homePage,
      meta: {
          title: '线路查询'
      },
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      meta: {
          title: '线路查询'
      },
    },
    {
      path: '/getAddress',
      name: 'getAddress',
      component: getAddress,
      meta: {
          title: '线路查询'
      },
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail,
      meta: {
          title: '线路查询'
      },
    },
    {
      path: '/busLine',
      name: 'busLine',
      component: busLine,
      meta: {
          title: '公交路线'
      },
    },
    {
      path: '/map',
      name: 'map',
      component: map,
      meta: {
          title: '公交路线'
      },
    },
    {
      path: '/busMap',
      name: 'busMap',
      component: busMap,
      meta: {
          title: '公交选点'
      },
    },
    {
      path: '/queryResult',
      name: 'queryResult',
      component: queryResult,
      meta: {
          title: '搜索结果'
      },
    },
    {
      path: '/test',
      name: 'test',
      component: test,
      meta: {
          title: '搜索结果'
      },
    },
    {
      path: '/setAddress',
      name: 'setAddrerss',
      component: setAddress,
      meta:{
          title: '常用地点'
      },
    }
];
Vue.use(VueRouter);

export const router = new VueRouter({
    // mode: 'history',
    routes,
});
router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});
router.afterEach(route => {
    // 从路由的元信息中获取 title 属性
    if (route.meta.title) {
        document.title = route.meta.title;
        // 如果是 iOS 设备，则使用如下 hack 的写法实现页面标题的更新
        if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            const hackIframe = document.createElement('iframe');
            hackIframe.style.display = 'none';
            hackIframe.src = '/static/html/fixIosTitle.html?r=' + Math.random();
            document.body.appendChild(hackIframe);
            setTimeout(_ => {
                document.body.removeChild(hackIframe)
            }, 10)
        }
    }
});


