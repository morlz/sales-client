import api from '@/api'


const formatTask = ({ id, contacts, description, managerresponsible, date, type, salon }) => {
	let { fio } = contacts.find(el => el.regard == "Основной")
	let { FIO: manager } = managerresponsible

	return {
		id,
		fio,
		description,
		date,
		manager,
		type: type.title,
		salon: salon.NAME
	}
}


let fieldDescription = [
	//{ field: "id", label: "№", type: "string" },
	{ field: "fio", label: "ФИО", type: "string" },
	{ field: "description", label: "Задача", type: "string" },
	{ field: "date", label: "Дата", type: "string" },
	{ field: "manager", label: "Ответсвенный", type: "string" },
	{ field: "type", label: "Тип", type: "string" },
	//{ field: "endManager", label: "Завершил", type: "string" },
	//{ field: "endDate", label: "Дата завершения", type: "string" },
	//{ field: "summ", label: "Сумма", type: "number" },
	//{ field: "created_at", label: "Дата создания", type: "string" },
	//{ field: "creatorManager", label: "Создатель", type: "string" },
	{ field: "salon", label: "Салон", type: "string" },
]

const state = {
	cached: [],
	loading: true,
	types: [],
	current: 0,
	loading: true,
	currentLoading: true
}

const actions = {
	getAllTasks({ commit, dispatch }){
		api.preorders.tasks
			.getAll()
			.then(({ data }) => {
				commit('updateCachedTasks', data)
				commit('loadingTasksSet', false)
			})
	},
	getOneTask({ commit, dispatch }, payload){
		commit('setCurrentTask', payload)
		commit('oneLoadingTaskSet', true)
		api.preorders.tasks
			.getOne(payload)
			.then(({ data }) => {
				commit('updateCachedTasks', [data])
				commit('oneLoadingTaskSet', false)
			})
	},
	getAllTaskTypes({ commit, dispatch }){
		api.preorders.tasks
			.getAllTypes()
			.then(({ data }) => {
				commit('setTaskTypes', data)
			})
	}
}

const mutations = {
	updateCachedTasks(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	updateCachedTask(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el2 => el2.id != id)
		store.cached.push(payload)
	},
	removeCachedTasks(store, payload){
		payload.map(data => {
			let id = data.id || data
			store.cached = store.cached.filter(el => el.id != id)
		})
	},
	removeCachedTask(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el => el.id != id)
	},
	loadingTasksSet(store, payload) {
		store.loading = payload
	},
	setTaskTypes(store, payload){
		store.types = payload
	},
	loadingTasksSet(store, payload) {
		store.loading = payload
	},
	oneLoadingTaskSet(store, payload) {
		store.currentLoading = payload
	},
	setCurrentTask(store, payload){
		store.current = payload
	}
}

const getters = {
	loadingTasks({ loading }){
		return loading
	},
	loadingCurrentTask({ currentLoading }){
		return currentLoading
	},
	currentTask({ cached, current }) {
		return cached.find(el => el.id == current) || {}
	},
	cachedTasks({ cached }){
		return cached
	},
	cachedTasksFormated({ cached }){
		return cached.map(formatTask)
	},
	taskTypes({ types }){
		let rez = []
		types.map(task => {
			rez[task.id] = task
		})
		return rez
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}
