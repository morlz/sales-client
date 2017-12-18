import api from '@/api'

const state = {
	cached: [],
	filters: [],
	sort: [],
	types: [],
	current: {},
	loading: true,
	loadingBottom: false,
	oneLoading: true,
	editTaskFormVisible: false,
	offset: 0,
	lastOffset: -1,
	currentEdited: {},
	perLoadingLimit: 30,
}

const actions = {
	tasksSortChanged({ commit, dispatch }, payload){
		dispatch('tasksCacheClear')
		commit('changeTasksLastOffset', -1)
		commit("tasksSortChange", payload)
	},
	tasksFiltersChange({ commit, dispatch }, payload){
		dispatch('tasksCacheClear')
		commit('changeTasksLastOffset', -1)
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
		if (state.lastOffset == state.offset) return
		commit('changeTasksLastOffset', state.offset)
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
				if (data.length) payload.loaded()
				if (!data.length) payload.complete ()
			})
	},
	getOneTask({ commit, dispatch }, payload){
		commit('oneLoadingTaskSet', true)
		api.preorders.tasks
			.getOne(payload)
			.then(({ data }) => {
				commit('setCurrentTask', data)
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
	getAllTaskStatuses({ commit, dispatch }) {
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
	},
	updateTask({ commit, dispatch }, payload){
		api.preorders.tasks
			.update(payload)
			.then(({ data }) => {
				console.log(data);
			})
	}
}

const mutations = {
	changeTasksLastOffset (store, payload) {
		store.lastOffset = payload
	},
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
	},
	updateEditTaskFormVisible(store, payload){
		store.editTaskFormVisible = payload
	},
	setCurrentEditedTask(store, payload){
		store.currentEdited = payload
	}
}

const getters = {
	tasksCachedIds: ({ cached }) => cached.map(el => el.id),
	currentTask: ({ current }) => current,
	cachedTasks: ({ cached }) => cached,
	loadingTasks: ({ loading }) => loading,
	loadingBottomTasks: ({ loadingBottom }) => loadingBottom,
	oneLoadingTask: ({ oneLoading }) => oneLoading,
	tasksByPhone: ({ cached, searchByPhoneQuery }) => [], 		//cached.filter(el => el.phone.indexOf(searchByPhoneQuery) + 1 || el.name.toLowerCase().indexOf(searchByPhoneQuery.toLowerCase()) + 1),
	loadingTasksByPhone: ({ loadingByPhone }) => loadingByPhone,
	taskFIlters: ({ searchByPhoneQuery: phone, filters }) => Object.assign({ phone }, filters),
	taskStatuses: ({ statuses }) => statuses,
	taskTypes ({ types }) {
		let rez = []
		types.map(task => {
			rez[task.id] = task
		})
		return rez
	},
	editTaskFormVisible: ({ editTaskFormVisible }) => editTaskFormVisible,
	currentEditedTask: ({ currentEdited }) => currentEdited
}

export default {
	state,
	actions,
	mutations,
	getters
}
