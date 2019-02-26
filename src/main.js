import Vue from 'vue'

//axios
import VueAxios from 'vue-axios'
import axios from './utils/request'

//normalize
import 'normalize.css/normalize.css'
//global css
import '@/styles/index.scss'

//element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

//app
import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

//components
import Pagination from '@/components/Pagination'

//directive
import Waves from '@/directive/waves/index.js' // 水波纹指令

//filter
import * as filters from './filters' //

Vue.use(VueAxios, axios)
Vue.use(ElementUI, {locale})

Vue.config.productionTip = false

Vue.component('pagination', Pagination)

Vue.directive('waves', Waves)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
