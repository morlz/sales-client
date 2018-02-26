import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
		statuses: []
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: true,
		statuses: true,
		bottom: false
	},
	add: {}
}

const actions = {
	async preorder_init ({ commit, dispatch }, payload) {
		dispatch('preorder_getStatuses')
		if (payload) {
			await dispatch('preorder_getOne', payload)
		} else {
			await dispatch('preorder_infinityStart')
		}
	},
	preorder_sortChange({ commit, dispatch }, payload){
		commit("preorder_sortSet", payload)
		dispatch('preorder_infinityStart')
	},
	preorder_filtersChange({ commit, dispatch }, payload){
		commit("preorder_filtersSet", payload)
		dispatch('preorder_infinityStart')
	},
	async preorder_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return

		commit('preorder_lastOffsetSet', state.offset.current)
		commit('preorder_loadingBottomSet', true)
		let res = await api.preorders.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.preorder_filters,
			sort: state.sort
		})
		commit('preorder_loadingSet', false)
		commit('preorder_loadingBottomSet', false)
		if (!res.data || res.data.error) return

		commit('preorder_cacheAppend', res.data)
		commit('preorder_currentOffsetSet')
		payload.loaded()
		if (!res.data.length)
			payload.complete()
	},
	async preorder_infinityStart({ commit, dispatch, state, getters }){
		commit('preorder_lastOffsetSet', 0)
		commit('preorder_currentOffsetSet', 0)
		commit('preorder_loadingBottomSet', true)
		commit('preorder_loadingSet', true)
		let res = await api.preorders.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.preorder_filters,
			sort: state.sort
		})
		commit('preorder_loadingBottomSet', false)
		commit('preorder_loadingSet', false)
		if (!res.data || res.data.error) return

		commit('preorder_cacheSet', res.data)
		commit('preorder_currentOffsetSet')
	},
	async preorder_getOne({ commit, dispatch }, payload){
		commit('preorder_loadingOneSet', true)
		let res = await api.preorders.getOne(payload)
		commit('preorder_loadingOneSet', false)
		if (!res.data || res.data.error) return

		commit('preorder_currentSet', res.data)
	},
	async preorder_getStatuses({ commit, dispatch }, payload){
		commit('preorder_loadingStatusesSet', true)
		let res = await api.preorders.getStatuses(payload)
		commit('preorder_loadingStatusesSet', false)
		if (!res.data || res.data.error) return

		commit('preorder_cachedStatusesSet', res.data)
	},
	async preorder_createNew ({ commit, dispatch, getters }) {
		let res = await api.preorders.create({
			main: getters.preorder_add,
			nextTask: getters.task_add_next,
			client: getters.client_selectCurrent,
			clientType: getters.client_selectType
		})
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		dispatch('notify', { message: 'Предзаказ создан' })
		router.push({ path: `/preorder/preorders/${res.data.preorder.id}` })
	}
}

const mutations = {
	preorder_cacheSet: (state, payload) => state.cached.list = payload,
	preorder_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	preorder_filtersSet: (state, payload) => state.filters = payload,
	preorder_sortSet: (state, payload) => state.sort = payload,
	preorder_lastOffsetSet: (state, payload) => state.offset.last = payload,
	preorder_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	preorder_currentSet: (state, payload) => state.cached.current = payload,
	preorder_currentTaskUpdate: (state, payload) => api.core.assignItem(state.cached.current.tasks, payload),
	preorder_currentContctAdd: (state, payload) => state.cached.current.contactFaces.push(payload),
	preorder_currentContctUpdate: (state, payload) => api.core.assignItem(state.cached.current.contactFaces, payload),
	preorder_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	preorder_cachedStatusesSet: (state, payload) => state.cached.statuses = payload,
	preorder_loadingSet: (state, payload) => state.loading.list = payload,
	preorder_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	preorder_loadingOneSet: (state, payload) => state.loading.one = payload,
	preorder_loadingStatusesSet: (state, payload) => state.loading.statuses = payload,
	preorder_add_set: (state, payload) => state.add = payload,
}

const getters = {
	preorder_filters: ({ filters }) => filters,
	preorder_filtersPhone: ({ filters }) => filters.phone || "",
	preorder_current: ({ cached }) => cached.current,
	preorder_cached: ({ cached }) => cached.list,
	preorder_statuses: ({ cached }) => cached.statuses,
	preorder_loading: ({ loading }) => loading.list,
	preorder_loadingBottom: ({ loading }) => loading.bottom,
	preorder_loadingOne: ({ loading }) => loading.one,
	preorder_acceptedAdd: state => state.filters && state.filters.phone && state.filters.phone.length && !state.loading.list,
	preorder_add: state => state.add,
}

export default {
	state,
	actions,
	mutations,
	getters
}
