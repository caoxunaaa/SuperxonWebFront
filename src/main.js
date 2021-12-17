// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import $ from 'jquery'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import VideoPlayer from 'vue-video-player'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
import * as echarts from 'echarts'
import common from './utils/common'
import loadExporting from 'highcharts/modules/exporting'
import exportExcel from 'highcharts/modules/export-data.src'
import Navigation from '@/components/Navigation'
import JsonExcel from 'vue-json-excel'
import VueBus from 'vue-bus'
import Moment from 'moment'
import globalFunc from '@/common/global_func'
/* import 'lib-flexible' */

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.prototype.$ = $
Vue.prototype.moment = Moment
Vue.prototype.common = common
Vue.prototype.$axios = axios // 全局注册，使用方法为this.$axios
Vue.prototype.$echarts = echarts
// 拦截器
axios.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  let regex = /.*csrftoken=([^;.]*).*$/ // 用于从cookie中匹配 csrftoken值
  config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1]
  config.headers.authorization = localStorage.getItem('Token')
  return config
}, error => {
  return Promise.reject(error)
})

export default (instance) => {
  instance.prototype.axios = (data) => {
    var _params = {
      method: !data.method ? 'get' : data.method.toLowerCase(),
      url: data.url
    }
    if (_params.method === 'get') {
      _params.params = data.params || {}
    } else {
      _params.data = data.params || {}
    }

    return new Promise((resolve, reject) => {
      axios(_params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

Vue.use(globalFunc)
Vue.use(VueBus)
Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.use(VideoPlayer)
Vue.use(Highcharts)
loadExporting(Highcharts)
exportExcel(Highcharts)
highcharts3d(Highcharts)
Vue.use(HighchartsVue)
Vue.component('downloadExcel', JsonExcel)
Vue.component('navigation', Navigation)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// axios.defaults.timeout = 1000 * 60 * 30
axios.defaults.baseM1URL = '/api'
axios.defaults.baseM2URL = '/display'
// axios.defaults.baseM1URL = ''
// axios.defaults.baseM2URL = 'http://172.20.2.246:8002'

//
Vue.directive('ban-save', {
  inserted (elem, vnode) {
    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
        e.preventDefault()
      }
    })
    document.oncontextmenu = function () {
      return false
    }
    document.querySelector('iframe').onload = function () {
      // iframe 禁用 右键
      this.contentWindow.document.oncontextmenu = function () {
        return false
      }
      // iframe 禁用 ctrl + s
      this.contentWindow.addEventListener('keydown', function (e) {
        if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }, true)
    }
  }
})

// 对get请求传递过来的参数处理
function paramsToUrl (url, params) {
  if (!params) return url
  for (var key in params) {
    if (params[key] && params[key] !== 'undefined') {
      if (url.indexOf('?') !== -1) {
        url += '&' + '' + key + '=' + params[key] || '' + ''
      } else {
        url += '?' + '' + key + '=' + params[key] || '' + ''
      }
    }
  }
  return url
}

// 封装请求
function requireData (url, params, type, item) {
  if (!url) return false
  switch (item) {
    case 'M1':
      url = axios.defaults.baseM1URL + url
      break
    case 'M2':
      url = axios.defaults.baseM2URL + url
      break
    default:
      url = axios.defaults.baseM4URL + url
  }
  if (type === 'get') {
    url = paramsToUrl(url, params)
    return new Promise((resolve, reject) => {
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

// 调用接口1的请求数据方法
Vue.prototype.reqM1Service = function (url, params, type) {
  return requireData.call(this, url, params, type, 'M1')
}
// 调用接口2的请求数据方法
Vue.prototype.reqM2Service = function (url, params, type) {
  return requireData.call(this, url, params, type, 'M2')
}

// 封装axios请求在切换页面后中断上个页面的padding请求
window._axiosPromiseArr = []
axios.interceptors.request.use(function (config) {
  config.cancelToken = new axios.CancelToken(cancel => {
    window._axiosPromiseArr.push({ cancel })
  })
  return config
})
router.beforeEach((to, from, next) => {
  window._axiosPromiseArr.forEach((ele, index) => {
    ele.cancel()
    delete window._axiosPromiseArr[index]
  })
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
