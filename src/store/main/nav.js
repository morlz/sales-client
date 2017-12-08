import api from '@/api'

const state = {
	menuOpen: false,
	menuItems: [{
			name: 'Главная',
			path: "",
			icon: "el-icon-home"
		},
		{
			name: 'Помощь',
			path: "",
			icon: "el-icon-info"
		},
		{
			name: "Мебель",
			childs: [{
					name: "Мебель во всех салоах",
					path: "/furniture/allSalons"
				},
				{
					name: "В салоне",
					path: "/furniture/oneSalon"
				},
				{
					name: "На складе (Готовая и в работе)",
					path: ""
				},
				{
					name: "Интернет-магазин",
					path: ""
				},
				{
					name: "Склад дисконт",
					path: ""
				},
				{
					name: "В заказе",
					path: ""
				},
				{
					name: "Заказать изготовление",
					path: ""
				},
			]
		},
		{
			name: 'Сервис',
			childs: [{
					name: "Доставки",
					path: ""
				},
				{
					name: "Прайс",
					path: ""
				},
				{
					name: "Доставки (Отчёт)",
					path: ""
				},
				{
					name: "Доставки 2",
					path: ""
				},
			]
		},
		{
			name: 'Документы',
			childs: [{
					name: "Счета",
					path: "/docs/accounts"
				},
				{
					name: "Счета (Отказ)",
					path: ""
				},
				{
					name: "Итоги \"p\"",
					path: ""
				},
				{
					name: "Итоги по продажам",
					path: ""
				},
			]
		},
		{
			name: "Отчёты",
			childs: [{
					name: "Реклама",
					path: ""
				},
				{
					name: "Отчёт по продажам",
					path: ""
				},
				{
					name: "Приход",
					path: ""
				},
				{
					name: "Отчёт 2",
					path: ""
				},
				{
					name: "Отчёт по оборачиваемости",
					path: ""
				},
				{
					name: "Подиум",
					path: ""
				},
				{
					name: "Отчёт по доставкам",
					path: ""
				},
				{
					name: "Отчёт по продажам и отгрузке",
					path: ""
				},
				{
					name: "Отчёт интернет",
					path: ""
				},
				{
					name: "Новая акция",
					path: ""
				},
			]
		},
		{
			name: 'Наработки',
			childs: [{
					name: "Наработки",
					path: ""
				},
				{
					name: "Действия",
					path: ""
				}
			]
		},
		{
			name: 'Предзаказы',
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
		}
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
	}
}

const getters = {
	menuOpen ({ menuOpen }) {
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
