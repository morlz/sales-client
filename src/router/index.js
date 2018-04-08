import Vue from 'vue'
import VueRouter from 'vue-router'
import formatTitle from '@/lib/formatTitle'

import routes from './routes'

Vue.use(VueRouter)

const scrollBehavior = t => {
	document.title = formatTitle(t.meta.name)
	return { y: 0 }
}

global.router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * If you decide to go with "history" mode, please also set "build.publicPath"
   * to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior,
  routes
})

export default router
