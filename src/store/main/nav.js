import api from '@/api'

const state = {
	open: {
		left: false,
		right: false
	},
	menuItems: [
		{
			name: 'Главная',
			path: "/",
			icon: "el-icon-home"
		},
		{
			name: 'Помощь',
			path: "/help",
			icon: "el-icon-info"
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
					can: { lvl: 1, action: "Furniture" }
				},
				{
					name: "Дисконт",
					path: "/furniture/discount",
					icon: "el-icon-discount",
					can: { lvl: 1, action: "Furniture" }
				},
				{
					name: 'Заказать изготовление',
					path: '/furniture/new',
					icon: 'el-icon-order-poduction',
					can: { lvl: 2, action: "Furniture" }
				},
				{
					name: 'Тест',
					path: '/test/test1',
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
					can: { lvl: 1, action: "Invoice" }
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
			can: { lvl: 1, action: "Developments" },
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
			childs: [{
					name: "Итоги продаж",
					path: "/reports/sales",
					icon: "el-icon-sell-result"
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
					name: "Роли",
					path: "/admin/roles",
					icon: "el-icon-roles",
					can: { lvl: 1, action: "Role" }
				},
				{
					name: "Тестирование",
					path: "/admin/tests",
					icon: "el-icon-roles",
					can: { lvl: 1, action: "Role" }
				},
			]
		},
	]
}

const actions = {

}

const mutations = {
	nav_openSet: (state, payload) => state.open = payload,
	nav_openLeftSet: (state, payload) => state.open.left = payload,
	nav_openToggle: state => state.open.left = !state.open.left,
	openMenu (state) {
		state.menuOpen = true
	},
	closeMenu (state) {
		state.menuOpen = false
	},
	changeMenuFixed (state, payload) {
		state.menuFixed = payload
	},
	changeMenuFixedState (state, payload) {
		state.menuFixedState = payload
	}
}

const getters = {
	nav_open: (state, getters) => ({ ...state.open, left: state.open.left || getters.app_view_desktop }),
	nav_items: state => state.menuItems
}

export default {
	state,
	actions,
	mutations,
	getters
}
