import Vue from 'vue'
import Router from 'vue-router'


import home 		from '@/pages/home'

import allSalons 	from '@/pages/furniture/allSalons.vue'
import salon 		from '@/pages/furniture/salon.vue'

import clients 		from '@/pages/preOrder/clients.vue'
import records 		from '@/pages/preOrder/records.vue'
import tasks 		from '@/pages/preOrder/tasks.vue'

import invoices 	from '@/pages/docs/invoices.vue'
import shipments 	from '@/pages/docs/shipments.vue'

import profile 		from '@/pages/main/profile.vue'
import p404 		from '@/pages/main/p404.vue'

Vue.use(Router)

let routes = [
	{ path: '/', component: home, name: 'home' },
	{ path: '/profile/:id?', component: profile, name: 'profile' },
	{ path: '/furniture/allSalons', component: allSalons },
	{ path: '/furniture/salon', component: salon },
	{ path: '/docs/invoices/:id?', component: invoices, props: { type: "invoices" } },
	{ path: '/docs/movements/:id?', component: invoices, props: { type: "movements" } },
	{ path: '/docs/shipments/:id?/:date?', component: shipments },
	{ path: '/preorder/clients/:id?', component: clients },
	{ path: '/preorder/records/:id?', component: records },
	{ path: '/preorder/tasks/:id?', component: tasks },
	{ path: '*', component: p404 }
]

global.router = new Router({
	routes
})

export default router
