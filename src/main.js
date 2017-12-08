import ElementUI from 'element-ui'
import VueGoodTable from 'vue-good-table'

Vue.use(VueGoodTable)
Vue.use(ElementUI)

import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store/index'
import { sync } from 'vuex-router-sync'

const unsync = sync(store, router)


// eslint-disable-next-line

import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
