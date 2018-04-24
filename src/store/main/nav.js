import api from '@/api'

const state = {
	open: false,
	names: {
		show: false
	},
	menuItems: [
		{
			name: 'Главная',
			path: "/",
			icon: "el-icon-home",
		},
		{
			name: 'Помощь',
			path: "/help",
			icon: "fa-info"
		},
		{
			name: "Мебель",
			icon: "el-icon-furniture",
			can: { lvl: 1, action: "Furniture" },
			childs: [{
					name: "В салоне",
					path: "/furniture/salon",
					icon: "el-icon-salon",
					can: { lvl: 1, action: "Furniture" }
				},
				{
					name: "На складе",
					path: "/furniture/storage",
					icon: "el-icon-storage",
					can: { lvl: 1, action: "Storage" }
				},
				{
					name: "Дисконт",
					path: "/furniture/discount",
					icon: "el-icon-discount",
					can: { lvl: 1, action: "Discount" }
				},
				{
					name: 'Заказать изготовление',
					path: '/furniture/new',
					icon: 'el-icon-order-poduction',
					can: { lvl: 2, action: "Furniture" }
				},
				{
					name: 'Распределение грузов',
					path: '/furniture/allocation',
					icon: 'el-icon-allocation',
					can: { lvl: 1, action: 'CargoDistribution' }
				}
			]
		},
		{
			name: 'Документы',
			icon: "el-icon-docs",
			can: { lvl: 1, action: "Docs" },
			childs: [{
					name: "Заказы",
					path: "/docs/invoices",
					icon: "el-icon-order",
					can: { lvl: 1, action: "Invoice" }
				},
				{
					name: "Перемещения",
					path: "/docs/movements",
					icon: "el-icon-movement",
					can: { lvl: 1, action: "Movement" }
				},
				{
					name: "Доставки",
					path: "/docs/shipments",
					icon: "el-icon-shipments",
					can: { lvl: 1, action: "Shipment" }
				},
			]
		},
		{
			name: 'Наработки',
			icon: "el-icon-code",
			can: { lvl: 1, action: "CRM" },
			childs: [{
					name: "Клиенты",
					path: "/preorder/clients",
					icon: "el-icon-clients",
					can: { lvl: 1, action: "Client" }
				},
				{
					name: "Предзаказы",
					path: "/preorder/preorders",
					icon: "el-icon-preorder",
					can: { lvl: 1, action: "Preorder" }
				},
				{
					name: "Задачи",
					path: "/preorder/tasks",
					icon: "el-icon-list",
					can: { lvl: 1, action: "Task" }
				}
			]
		},
		{
			name: "Отчёты",
			icon: "el-icon-report",
			can: { lvl: 1, action: "Report" },
			childs: [
				{
					name: "Итоги продаж",
					path: "/reports/sales",
					icon: "el-icon-sell-result",
					can: { lvl: 1, action: "ReportSales" },
				},
				{
					name: "Отчёт 2",
					path: "/reports/salesTwo",
					icon: "fa-list-alt",
					can: { lvl: 1, action: "ReportSalesTwo" },
				},
				{
					name: "Итоги продаж",
					path: "/reports/resume",
					icon: "fa-braille",
					can: { lvl: 1, action: "ReportResume" },
				},
			]
		},
		{
			name: "Администрирование",
			icon: "el-icon-admin",
			can: { lvl: 1, action: "Admin" },
			childs: [
				{
					name: "Персонал",
					path: "/admin/personal",
					icon: "el-icon-personal",
					can: { lvl: 1, action: "Manager" }
				},
				{
					name: "Настройка прав",
					path: "/admin/permissions",
					icon: "group_work",
					can: { lvl: 1, action: "Role" }
				},
				{
					name: "Тестирование",
					path: "/admin/tests",
					icon: "fa-bug",
					can: { lvl: 1, action: "Tests" }
				},
			]
		},
	]
}

const actions = {

}

const mutations = {
	nav_openSet: (state, payload) => state.open = payload,
	nav_openLeftSet: (state, payload) => state.open = !state.open,
	nav_namesShowSet: (state, payload) => state.names.show = payload,
	nav_openToggle: state => state.open = !state.open,
}

const getters = {
	nav_open: state => state.open,
	nav_namesShow: state => state.names.show,
	nav_items: state => state.menuItems
}

export default {
	state,
	actions,
	mutations,
	getters
}
