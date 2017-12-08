import Vue from 'vue'
import Router from 'vue-router'


import home from '@/pages/home'

import allSalons from '@/pages/furniture/allSalons.vue'
import oneSalon from '@/pages/furniture/oneSalon.vue'

import clients from '@/pages/preOrder/clients.vue'
import records from '@/pages/preOrder/records.vue'
import tasks from '@/pages/preOrder/tasks.vue'

import accounts from '@/pages/docs/accounts.vue'
import p404 from '@/pages/main/p404.vue'

Vue.use(Router)

let routes = [
	{
		path: '/',
		name: 'home',
		component: home,
	},
	{
		path: '/furniture/allSalons',
		component: allSalons
	},
	{
		path: '/furniture/oneSalon',
		component: oneSalon
	},
	{
		path: '/docs/accounts',
		component: accounts
	},
	{
		path: '/preorder/clients/:id?',
		component: clients
	},
	{
		path: '/preorder/records/:id?',
		component: records
	},
	{
		path: '/preorder/tasks/:id?',
		component: tasks
	},
	{
		path: '*',
		component: p404
	}
]

global.router = new Router({
	routes
})

export default router
