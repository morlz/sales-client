import Vue from 'vue'
import invoices 		from '@/pages/docs/invoices'
import furnitureNew		from '@/pages/furniture/new'

let movements = Vue.extend({ ...invoices, name: 'movements' }),
	furnitureEdit = Vue.extend({ ...furnitureNew, name: 'furnitureEdit' })


export default [
	{
		path: '/',
		component: () => import ('layouts/default'),
		children: [
			{ path: '', 							component: () => import ('pages/index'),						meta: { name: "Главная" } },

			{ path: '/admin/personal/:id?', 		component: () => import ('pages/admin/Personal'), 				meta: { name: "Перонал" } },
			{ path: '/admin/permissions/', 			component: () => import ('pages/admin/Permissions'), 			meta: { name: "Настройка прав" } },
			{ path: '/admin/tests/', 				component: () => import ('pages/admin/tests'), 					meta: { name: "Тест" } },

			{ path: '/profile/:id?', 				component: () => import ('pages/main/ManagerProfile'), 			meta: { name: "Профиль" } },

			{ path: '/furniture/allocation', 		component: () => import ('pages/furniture/allocation'), 		meta: { name: "Распределение грузов" } },
			{ path: '/furniture/storage', 			component: () => import ('pages/furniture/storage'), 			meta: { name: "Мебель на складе" } },
			{ path: '/furniture/discount', 			component: () => import ('pages/furniture/discount'), 			meta: { name: "Мебель дисконд" } },
			{ path: '/furniture/salon/:id?', 		component: () => import ('pages/furniture/salon'), 				meta: { name: "Мебель в салоне" } },
			{ path: '/furniture/new/', 				component: furnitureNew, 										meta: { name: "Заказ на изготовление" } },
			{ path: '/furniture/edit/:id?', 		component: furnitureEdit, 										meta: { name: "Редактирование заказа" } },

			{ path: '/docs/createInvoice', 			component: () => import ('pages/docs/createInvoice'), 			meta: { name: "Оформление заказа" }, },
			{ path: '/docs/invoices/:id?', 			component: invoices, 											meta: { name: "Выставленые счета" }, 			props: { type: "invoices" } },
			{ path: '/docs/movements/:id?', 		component: movements, 											meta: { name: "Перемещения" },					props: { type: "movements" } },
			{ path: '/docs/shipments/:id?', 		component: () => import ('pages/docs/shipments'), 				meta: { name: "Доставки" } },

			{ path: '/preorder/clients/:id?', 		component: () => import ('pages/preOrder/clients'), 			meta: { name: "Клиенты" } },
			{ path: '/preorder/preorders/:id?', 	component: () => import ('pages/preOrder/preorders'), 			meta: { name: "Предзаказы" } },
			{ path: '/preorder/tasks/:id?', 		component: () => import ('pages/preOrder/tasks'), 				meta: { name: "Задачи" } },

			{ path: '/reports/sales/', 				component: () => import ('pages/reports/sales'), 				meta: { name: "Отчёт по продажам" } },
			{ path: '/reports/salesTwo/', 			component: () => import ('pages/reports/salesTwo'), 			meta: { name: "Отчёт 2" } },
			{ path: '/reports/resume/', 			component: () => import ('pages/reports/resume/index'), 		meta: { name: "Итоги" },
				children: [
					{ path: '', 					component: () => import ('pages/reports/resume/all'), 			meta: { name: "Итоги всех салонов" } },
					{ path: 'month', 				component: () => import ('pages/reports/resume/month'), 		meta: { name: "Итоги салона" } },
					{ path: 'day/:date',			component: () => import ('pages/reports/resume/day'), 			meta: { name: "Итоги дня" } },
					{ path: 'best/:date', 			component: () => import ('pages/reports/resume/best'), 			meta: { name: "Лучшие салоны" } },
				]
			}
		]
	},
	{ // Always leave this as last one
		path: '*',
		component: () => import ('pages/404'),
		meta: { name: "Ошибка 404. Страница не найдена" }
	}
]
