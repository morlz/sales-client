import Vue from 'vue'
import Router from 'vue-router'


import test1		from '@/components/pages/test/test.vue'

import salon 		from '@/components/pages/furniture/salon.vue'
import storage 		from '@/components/pages/furniture/storage.vue'
import discount 	from '@/components/pages/furniture/discount.vue'
import furnitureNew	from '@/components/pages/furniture/new.vue'

import clients 		from '@/components/pages/preOrder/clients.vue'
import preorders 	from '@/components/pages/preOrder/preorders.vue'
import tasks 		from '@/components/pages/preOrder/tasks.vue'

import invoices 	from '@/components/pages/docs/invoices.vue'
import shipments 	from '@/components/pages/docs/shipments.vue'

import profile 		from '@/components/pages/main/profile.vue'
import p404 		from '@/components/pages/main/p404.vue'
import home 		from '@/components/pages/main/home.vue'

import roles 		from '@/components/pages/admin/roles.vue'
import personal 	from '@/components/pages/admin/personal.vue'
import tests 		from '@/components/pages/admin/tests.vue'



Vue.use(Router)

let routes = [
	{ path: '/', component: home, name: 'home' },
	{ path: '/test/test1', component: test1 },
	{ path: '/admin/roles/:id?', component: roles },
	{ path: '/admin/personal/:id?', component: personal },
	{ path: '/admin/tests/', component: tests },
	{ path: '/profile/:id?', component: profile },
	{ path: '/furniture/storage/:id?', component: storage },
	{ path: '/furniture/discount/:id?', component: discount },
	{ path: '/furniture/salon/:id?', component: salon },
	{ path: '/furniture/new/', component: furnitureNew },
	{ path: '/docs/invoices/:id?', component: invoices, props: { type: "invoices" } },
	{ path: '/docs/movements/:id?', component: invoices, props: { type: "movements" } },
	{ path: '/docs/shipments/:id?', component: shipments },
	{ path: '/preorder/clients/:id?', component: clients },
	{ path: '/preorder/preorders/:id?', component: preorders },
	{ path: '/preorder/tasks/:id?', component: tasks },
	{ path: '*', component: p404 }
]

global.router = new Router({
	routes
})

export default router
