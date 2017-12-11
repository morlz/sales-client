import api from '@/api'

const state = {
	cached: [],
	filters: [],
	sort: [],
	types: [],
	current: 0,
	loading: true,
	loadingBottom: false,
	oneLoading: true,
	perLoadingLimit: 30,
	offset: 0
}

const actions = {
	tasksSortChanged({ commit, dispatch }, payload){
		dispatch('tasksCacheClear')
		commit("tasksSortChange", payload)
	},
	tasksFiltersChange({ commit, dispatch }, payload){
		dispatch('tasksCacheClear')
		commit("tasksFiltersChange", payload)
	},
	tasksCacheClear({ commit, dispatch }){
		commit("clearCachedTasks")
		commit('setCurrentOffsetTasks')
		commit('loadingTasksSet', true)
	},
	getAllTasks({ commit, dispatch }, ids){
		api.preorders.tasks
			.getAll(ids)
			.then(({ data }) => {
				commit('updateCachedTasks', data)
				commit('loadingTasksSet', false)
			})
	},
	tasksInfinity({ commit, dispatch, state, getters }, payload){
		commit('loadingBottomTasksSet', true)
		api.preorders.tasks
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset,
				filters: getters.taskFIlters,
				sort: state.sort
			})
			.then(({ data }) => {
				commit('updateCachedTasks', data)
				commit('loadingTasksSet', false)
				commit('loadingBottomTasksSet', false)
				commit('setCurrentOffsetTasks')
				payload.loaded()
				if (!data.length) payload.complete ()
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
	searchTasksByPhone({ commit, dispatch }, payload){
		commit('updateSearchByPhoneQuery', payload)
		if (!payload) return
		commit('loadingByPhoneTasksSet', true)
		api.preorders.tasks
			.searchByPhone(payload)
			.then(({ data }) => {
				commit('updateCachedTasks', data)
				commit('loadingByPhoneTasksSet', false)
			})
	},
	getAllTaskStatuses ({ commit, dispatch }) {
		api.preorders.tasks
			.getSatuses()
			.then(({ data }) => {
				commit('setPreorderStatuses', data)
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
	clearCachedTasks (store, payload){
		store.cached = []
	},
	tasksFiltersChange (store, payload) {
		store.filters = payload
	},
	tasksSortChange (store, payload) {
		store.sort = payload
	},
	filtredRowsChange (store, payload) {
		store.filteredRows = payload
	},
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
	loadingBottomTasksSet(store, payload) {
		store.loadingBottom = payload
	},
	oneLoadingTaskSet(store, payload){
		store.oneLoading = payload
	},
	loadingByPhoneTasksSet(store, payload) {
		store.loadingByPhone = payload
	},
	updateSearchByPhoneQuery(store, payload) {
		state.searchByPhoneQuery = payload
	},
	setCurrentTask(store, payload) {
		store.current = payload
	},
	setCurrentOffsetTasks(store, payload) {
		store.offset = payload || store.cached.length
	},
	setTaskTypes(store, payload){
		store.types = payload
	},
	setPreorderStatuses(store, payload){
		store.statuses = payload
	}
}

const getters = {
	tasksCachedIds ({ cached }) {
		return cached.map(el => el.id)
	},
	currentTask({ cached, current }) {
		return cached.find(el => el.id == current) || {}
	},
	cachedTasks({ cached }){
		return cached
	},
	loadingTasks({ loading }){
		return loading
	},
	loadingBottomTasks({ loadingBottom }){
		return loadingBottom
	},
	oneLoadingTask({ oneLoading }){
		return oneLoading
	},
	tasksByPhone({ cached, searchByPhoneQuery }){
		return []//cached.filter(el => el.phone.indexOf(searchByPhoneQuery) + 1 || el.name.toLowerCase().indexOf(searchByPhoneQuery.toLowerCase()) + 1)
	},
	loadingTasksByPhone({ loadingByPhone }){
		return loadingByPhone
	},
	taskFIlters ({ searchByPhoneQuery: phone, filters }) {
		return Object.assign({ phone }, filters)
	},
	taskStatuses ({ statuses }) {
		return statuses
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
