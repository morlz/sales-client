import Vue from 'vue'
import Router from 'vue-router'




import allSalons 	from '@/pages/furniture/allSalons.vue'
import salon 		from '@/pages/furniture/salon.vue'

import clients 		from '@/pages/preOrder/clients.vue'
import records 		from '@/pages/preOrder/records.vue'
import tasks 		from '@/pages/preOrder/tasks.vue'

import invoices 	from '@/pages/docs/invoices.vue'
import shipments 	from '@/pages/docs/shipments.vue'

import profile 		from '@/pages/main/profile.vue'
import p404 		from '@/pages/main/p404.vue'
import home 		from '@/pages/main/home.vue'

import roles 		from '@/pages/admin/roles.vue'



Vue.use(Router)

let routes = [
	{ path: '/', component: home, name: 'home' },
	{ path: '/admin/roles/:id?', component: roles },
	{ path: '/profile/:id?', component: profile },
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
