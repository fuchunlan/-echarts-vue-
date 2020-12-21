import Vue from 'vue'
import Router from 'vue-router'
import App from "../App";
import chinaWraper from "../components/pages/chinaWraper";

import globalWraper from "../components/pages/globalWraper";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
      childrem:[
        {
          path: '/chinaWraper',
          name:'chinaWraper',
          component: chinaWraper
        },
        {
          path: '/globalWraper',
          name: 'globalWraper',
          component: globalWraper
        }
      ]
    }
  ]
})
