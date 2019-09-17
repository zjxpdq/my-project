/**
 * user name:  zjxpd
 * creation time:  2019/9/17 11:53
 */
import Vue from "vue"
import Router from "vue-router"
import routes from './router'

Vue.use(Router)

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(to => {
  window.scrollTo(0, 0)
})

export default router
