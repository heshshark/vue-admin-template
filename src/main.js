import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from './utils/request'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters' // 全局filter

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.use(ElementUI, { locale })
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
