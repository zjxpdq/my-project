import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './style/index.scss'
import api from './api'
// import SlideVerify from 'vue-monoplasty-slide-verify'
// Vue.use(SlideVerify)

Vue.use(iView)
Vue.use(api)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
