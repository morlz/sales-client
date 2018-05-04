import api from '@/api'
import Infinite from '@/lib/Infinite'

const state = {
	complete: false,
	infinite: false,
	filters: [],
	sort: [],
	cached: {
		list: [],
		current: {},
		types: []
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
	async task_init ({ commit, dispatch, state }, payload) {
		if (+payload) {
			await dispatch('task_getOne', payload)
		} else {
			commit('task_initInfinite', new Infinite({
				method: api.tasks.getLimited
			}))

			state.infinite.on('cached', n => commit('task_cacheSet', n))
			state.infinite.on('complete', n => commit('task_completeSet', n))

			await state.infinite.start()
		}
	},
	async task_sortChange({ commit, dispatch }, payload){
		commit("task_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async task_filtersChange({ commit, dispatch }, payload){
		commit("task_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async task_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
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
		let payload = { ...state.add },
			preorder_id = state.cached.current.preorder_id || getters.preorder_current ? getters.preorder_current.id : null

		payload.next = { ...payload.next, preorder_id }

		commit('task_loadingAddSet', true)
		let res = await api.tasks.create(payload)
		commit('task_loadingAddSet', false)
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		dispatch('notify', 'Задача успешно создана')
		router.push({ path: `/preorder/preorders/${res.data.next.preorder_id}` })
	},
}

const mutations = {
	task_destroy: state => state.cached.list = [],
	task_initInfinite: (state, payload) => state.infinite = payload,
	task_completeSet: (state, payload) => state.complete = payload,
	task_cacheSet: (state, payload) => state.cached.list = payload,
	task_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	task_cacheUpdate: (state, payload) => {
		let task = state.cached.list.find(el => el.id == payload.id)
		if (!task) return
		for (var prop in payload) if (payload.hasOwnProperty(prop)) task[prop] = payload[prop]
	},
	task_filtersSet: (state, payload) => state.filters = payload,
	task_sortSet: (state, payload) => state.sort = payload,
	task_lastOffsetSet: (state, payload) => state.offset.last = payload,
	task_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	task_currentSet: (state, payload) => state.cached.current = payload,
	task_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	task_cachedTypesSet: (state, payload) => state.cached.types = payload,
	task_loadingSet: (state, payload) => state.loading.list = payload,
	task_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	task_loadingOneSet: (state, payload) => state.loading.one = payload,
	task_loadingTypesSet: (state, payload) => state.loading.models = payload,
	task_loadingAddSet: (state, payload) => state.loading.add = payload,
	task_edit_currentSet: (state, payload) => state.edit.current = payload,
	task_edit_visibleSet: (state, payload) => state.edit.visible = payload,
	task_add_prevSet: (state, payload) => state.add.prev = payload,
	task_add_nextSet: (state, payload) => state.add.next = payload,
}

const getters = {
	task_complete: state => state.complete,
	task_filters: ({ filters }) => filters,
	task_current: ({ cached }) => cached.current,
	task_cached: state => state.cached.list,
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
