import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
		types: []
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: false,
		types: true,
		bottom: false,
		add: false
	},
	edit: {
		visible: false,
		current: {}
	},
	add: {
		prev: {},
		next: {}
	}
}

const actions = {
	async task_init ({ commit, dispatch }, payload) {
		if (+payload) {
			await dispatch('task_getOne', payload)
		} else {
			await dispatch('task_infinityStart')
		}
	},
	task_sortChange({ commit, dispatch }, payload){
		commit("task_sortSet", payload)
		dispatch('task_infinityStart')
	},
	task_filtersChange({ commit, dispatch }, payload){
		commit("task_filtersSet", payload)
		dispatch('task_infinityStart')
	},
	async task_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return

		commit('task_lastOffsetSet', state.offset.current)
		commit('task_loadingBottomSet', true)
		let res = await api.tasks.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.task_filters,
			sort: state.sort
		})
		commit('task_loadingSet', false)
		commit('task_loadingBottomSet', false)
		if (!res.data || res.data.error) return

		commit('task_cacheAppend', res.data)
		commit('task_currentOffsetSet')
		payload.loaded()
		if (!res.data.length)
			payload.complete()
	},
	async task_infinityStart({ commit, dispatch, state, getters }){
		commit('task_lastOffsetSet', 0)
		commit('task_currentOffsetSet', 0)
		commit('task_loadingBottomSet', true)
		commit('task_loadingSet', true)
		let res = await api.tasks.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.task_filters,
			sort: state.sort
		})
		commit('task_loadingBottomSet', false)
		commit('task_loadingSet', false)
		if (!res.data || res.data.error) return

		commit('task_cacheSet', res.data)
		commit('task_currentOffsetSet')
	},
	async task_getOne({ commit, dispatch }, payload){
		commit('task_loadingOneSet', true)
		let res = await api.tasks.getOne(payload)
			commit('task_loadingOneSet', false)
		if (!res.data || res.data.error) return

		commit('task_currentSet', res.data)
	},
	async task_getTypes({ commit, dispatch }, payload){
		commit('task_loadingTypesSet', true)
		let res = await api.tasks.getAllTypes(payload)
		commit('task_loadingTypesSet', false)
		if (!res.data || res.data.error) return

		commit('task_cachedTypesSet', res.data)
	},
	async task_update({ commit, dispatch }, payload){
		let res = await api.tasks.update(payload)
		if (!res.data || res.data.error) return

		commit('task_cacheUpdate', res.data)
		commit('preorder_currentTaskUpdate', res.data)
	},
	async task_create({ commit, dispatch, state, getters }){
		let payload = Object.assign({}, state.add),
			preorder_id = state.cached.current.preorder_id || getters.preorder_current ? getters.preorder_current.id : null

		payload.next = Object.assign({}, payload.next, { preorder_id })

		commit('task_loadingAddSet', true)
		let res = await api.tasks.create(payload)
		commit('task_loadingAddSet', false)
		if (!res.data || res.data.error) return

		if (data.errors)
			return dispatch('handleFormErrors', data.errors)

		dispatch('notify', { title: "Успешно", message: "Задача создана" })
		router.push({ path: `/preorder/preorders/${preorder_id}` })
	},
}

const mutations = {
	task_cacheSet: (state, payload) => state.cached.list = payload,
	task_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	task_cacheUpdate: (state, payload) => {
		let task = state.cached.list.find(el => el.id == payload.id)
		if (!task) return
		for (var prop in payload) if (payload.hasOwnProperty(prop)) task[prop] = payload[prop]
	},
	task_filtersSet: (store, payload) => store.filters = payload,
	task_sortSet: (store, payload) => store.sort = payload,
	task_lastOffsetSet: (store, payload) => store.offset.last = payload,
	task_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	task_currentSet: (store, payload) => store.cached.current = payload,
	task_currentOffsetSet: (store, payload) => store.offset.current = payload !== undefined ? payload : store.cached.list.length,
	task_cachedTypesSet: (store, payload) => store.cached.types = payload,
	task_loadingSet: (store, payload) => store.loading.list = payload,
	task_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	task_loadingOneSet: (store, payload) => store.loading.one = payload,
	task_loadingTypesSet: (store, payload) => store.loading.models = payload,
	task_loadingAddSet: (store, payload) => store.loading.add = payload,
	task_edit_currentSet: (store, payload) => store.edit.current = payload,
	task_edit_visibleSet: (store, payload) => store.edit.visible = payload,
	task_add_prevSet: (store, payload) => store.add.prev = payload,
	task_add_nextSet: (store, payload) => store.add.next = payload,
}

const getters = {
	task_filters: ({ filters }) => filters,
	task_current: ({ cached }) => cached.current,
	task_cached: ({ cached }) => cached.list,
	task_types: ({ cached }) => cached.types,
	task_loading: ({ loading }) => loading.list,
	task_loadingBottom: ({ loading }) => loading.bottom,
	task_loadingOne: ({ loading }) => loading.one,
	task_loadingTypes: ({ loading }) => loading.types,
	task_loadingAdd: ({ loading }) => loading.add,
	task_edit_visible: ({ edit }) => edit.visible,
	task_edit_current: ({ edit }) => edit.current,
	task_add_next: state => state.add.next
}

export default {
	state,
	actions,
	mutations,
	getters
}
