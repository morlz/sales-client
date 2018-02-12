import Vue from 'vue'
import Router from 'vue-router'
import formatTitle from '@/lib/formatTitle.js'

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

const scrollBehavior = t => {
	document.title = formatTitle(t.meta.name)
	return { y: 0 }
}

Vue.use(Router)

let routes = [
	{ path: '/', 							component: home, 				meta: { name: "Главная" } },
	{ path: '/test/test1', 					component: test1, 				meta: { name: "Тест1" } },
	{ path: '/admin/roles/:id?', 			component: roles, 				meta: { name: "Роли" } },
	{ path: '/admin/personal/:id?', 		component: personal, 			meta: { name: "Перонал" } },
	{ path: '/admin/tests/', 				component: tests, 				meta: { name: "Тест" } },
	{ path: '/profile/:id?', 				component: profile, 			meta: { name: "Профиль" } },
	{ path: '/furniture/storage/:id?', 		component: storage, 			meta: { name: "Мебель на складе" } },
	{ path: '/furniture/discount/:id?', 	component: discount, 			meta: { name: "Мебель дисконд" } },
	{ path: '/furniture/salon/:id?', 		component: salon, 				meta: { name: "Мебель в салоне" } },
	{ path: '/furniture/new/', 				component: furnitureNew, 		meta: { name: "Заказ на изготовление" } },
	{ path: '/docs/invoices/:id?', 			component: invoices, 			meta: { name: "Выставленые счета" }, 						props: { type: "invoices" } },
	{ path: '/docs/movements/:id?', 		component: invoices, 			meta: { name: "Перемещения" },								props: { type: "movements" } },
	{ path: '/docs/shipments/:id?', 		component: shipments, 			meta: { name: "Доставки" } },
	{ path: '/preorder/clients/:id?', 		component: clients, 			meta: { name: "Клиенты" } },
	{ path: '/preorder/preorders/:id?', 	component: preorders, 			meta: { name: "Предзаказы" } },
	{ path: '/preorder/tasks/:id?', 		component: tasks, 				meta: { name: "Задачи" } },
	{ path: '*', 							component: p404, 				meta: { name: "Ошибка 404. Страница не найдена" } }
]

global.router = new Router({
	routes,
	scrollBehavior
})

export default router
