import { postJSON, getJSON} from '../../utils/ajax';
import { apiHost, platformHost} from '../../config/index';

export default {
   //天气查询
   getWeatherList(data) {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${data.cityd}&key=${data.webKey}&extensions=${data.extensions}`;
    return getJSON(url)
          .then((response) => {
              return Promise.resolve(response);
          }, (response) => {
          return Promise.reject(response);
    });
  },
  //公交规划线路接口
  getResult(data) {
    const url = `https://restapi.amap.com/v3/direction/transit/integrated?origin=${data.origin}&destination=${data.destination}&strategy=${data.strategy}&city=${data.city}&cityd=${data.cityd}&key=${data.webKey}`;
    return getJSON(url,data)
          .then((response) => {
              return Promise.resolve(response);
          }, (response) => {
          return Promise.reject(response);
    });
  },
  //获取地址列表接口
  getAddressList(data) {
    const url = `https://restapi.amap.com/v3/assistant/inputtips?key=${data.webKey}&keywords=${data.address}&location=${data.location}&datatype=all&citylimit=${data.citylimit}&city=${data.city}`;
    return getJSON(url)
          .then((response) => {
              return Promise.resolve(response);
          }, (response) => {
          return Promise.reject(response);
    });
  },
    //根据关键字搜索接口
    getAddressList2(data) {
      const url = `https://restapi.amap.com/v3/place/text?key=${data.key}&keywords=${data.keywords}&offset=${data.offset}&page=${data.page}&citylimit=${data.citylimit}&city=${data.city}`;
      return getJSON(url)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
    },
  //获取距离接口
  getDistance(data) {
    const url = `https://restapi.amap.com/v3/distance?origins=${data.origins}&destination=${data.destination}&&key=${data.webKey}`;
    return getJSON(url)
          .then((response) => {
              return Promise.resolve(response);
          }, (response) => {
          return Promise.reject(response);
    });
  },
  // 新增地址搜索记录
  AddInsertHistory(data) {
      const url = `${apiHost}operation-site/busRoutes/insertHistory`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  // 搜索地址历史记录
  getSearchHistory(data) {
      const url = `${apiHost}operation-site/busRoutes/searchHistory`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  //清空搜素地址记录
  getclearHistory(data) {
    const url = `${apiHost}operation-site/busRoutes/clearHistory`;
    return postJSON(url,data)
          .then((response) => {
              return Promise.resolve(response);
          }, (response) => {
          return Promise.reject(response);
    });
  },
  // 新增首页记录
  addOrUpdateIndexPoints(data) {
      const url = `${apiHost}operation-site/busRoutes/addOrUpdateIndexPoints`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  // 首页历史记录列表
  getIndexHistory(data) {
      const url = `${apiHost}operation-site/busRoutes/indexHistory`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  // 清除首页记录
  getClearIndex(data) {
      const url = `${apiHost}operation-site/busRoutes/clearIndex`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  //新增编辑收藏地点
  addCollectionPoints(data) {
      const url = `${apiHost}operation-site/busRoutes/addOrUpdateCollectionPoints`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
    },
  //获取收藏地点列表
  getCollectionPoints(data) {
      const url = `${apiHost}operation-site/busRoutes/showCollectionPoints?userId=${data}`;
      return getJSON(url)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  //删除收藏地点
  deleteCollectionPoints(id) {
    const url = `${apiHost}operation-site/busRoutes/deleteCollectionPoints/${id}`;
    return getJSON(url)
          .then((response) => {
              return Promise.resolve(response);
          }, (response) => {
          return Promise.reject(response);
    });
  },
  //获取icon列表
  getIconList(data) {
      const url = `${apiHost}operation-push/push/page`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  //新增用户
  addBrowse(data) {
      const url = `${apiHost}operation-site/busRoutes/addBrowse`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  //查看浏览记录
  checkBrowse(data) {
      const url = `${apiHost}operation-site/busRoutes/checkBrowse`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
  //位置拖动排序
    sortAdddress(data) {
      const url = `${apiHost}operation-site/busRoutes/sortCollectionPoints`;
      return postJSON(url,data)
            .then((response) => {
                return Promise.resolve(response);
            }, (response) => {
            return Promise.reject(response);
      });
  },
};

