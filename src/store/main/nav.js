import api from '@/api'

const state = {
	menuOpen: false,
	menuFixed: false,
	menuFixedState: true,
	menuItems: [{
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
			childs: [{
					name: "В салоне",
					path: "/furniture/salon",
					icon: "el-icon-salon"
				},
				{
					name: "На складе",
					path: "/furniture/storage",
					icon: "el-icon-storage"
				},
				{
					name: "Дисконт",
					path: "/furniture/discount",
					icon: "el-icon-discount"
				}
			]
		},
		{
			name: 'Документы',
			icon: "el-icon-docs",
			childs: [{
					name: "Заказы",
					path: "/docs/invoices",
					icon: "el-icon-order"
				},
				{
					name: "Перемещения",
					path: "/docs/movements",
					icon: "el-icon-movement"
				},
				{
					name: "Доставки",
					path: "/docs/shipments",
					icon: "el-icon-shipments"
				},
			]
		},
		{
			name: 'Наработки',
			icon: "el-icon-code",
			childs: [{
					name: "Клиенты",
					path: "/preorder/clients",
					icon: "el-icon-clients"
				},
				{
					name: "Предзаказы",
					path: "/preorder/records",
					icon: "el-icon-preorder"
				},
				{
					name: "Задачи",
					path: "/preorder/tasks",
					icon: "el-icon-list"
				}
			]
		},
		{
			name: "Отчёты",
			icon: "el-icon-report",
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
			childs: [
				{
					name: "Роли",
					path: "/admin/roles",
					icon: "el-icon-roles"
				},
			]
		},
	]
}

const actions = {

}

const mutations = {
	toggleMenu (state) {
		state.menuOpen = !state.menuOpen
	},
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
	menuOpen ({ menuOpen, menuFixed, menuFixedState }) {
		if (menuFixed) return menuFixedState
		return menuOpen
	},
	menuItems ({ menuItems }) {
		return menuItems
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}
