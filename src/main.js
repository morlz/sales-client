// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
require(`quasar/dist/quasar.${__THEME}.css`)
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)

import Vue from 'vue'
import Quasar from 'quasar'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import '@/directives'
import router from '@/router'
import store from '@/store'
import App from '@/App'
import { sync } from 'vuex-router-sync'
import * as VueGoogleMaps from 'vue2-google-maps'
import VirtualScroller from 'vue-virtual-scroller'

//google maps config
const load = {
	key: 'AIzaSyAATHorjelWuNs0vz9wLrEhtGkwQa5NiQc',
	//v: 'OPTIONAL VERSION NUMBER',
	libraries: 'places',
}

Vue.use(VueGoogleMaps, { load })
Vue.use(ElementUI, { locale })
Vue.use(VirtualScroller)
Vue.use(Quasar) // Install Quasar Framework

if (__THEME === 'mat')
	require('quasar-extras/roboto-font')

import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

const unsync = sync(store, router)

Vue.config.productionTip = false

Quasar.start(() => {
	new Vue({
		el: '#q-app',
		router,
		store,
		render: h => h(App)
	})
})
