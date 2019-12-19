import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import './style/index.scss'
import api from './api'
import VueJsonp from 'vue-jsonp'

Vue.use(VueJsonp)
Vue.use(ViewUI)
Vue.use(api)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")
