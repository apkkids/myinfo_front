/* eslint-disable no-new */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {getRequest, postRequest, deleteRequest, putRequest} from './utils/api'
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest

// router.beforeEach((to, from, next) => {
//   // 此处尚未完成
//   var name = store.state.user.name
//   console.log(name)
// }
// )

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
