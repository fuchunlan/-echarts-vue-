// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//import store from './store/index'
import './assets/css/common.css'
import $ from  'jquery'


// 引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 按需引入vant
// import {Button} from "vant";
// Vue.use(Button)
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 引入axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios)
Vue.prototype.$axios = axios //axios不能通过Vue.use绑定
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  //store,
  components: { App },
  template: '<App/>'
})
