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
	}
}

const actions = {
	preorder_init ({ commit, dispatch }, payload) {
		dispatch('preorder_getStatuses')
		if (payload) {
			dispatch('preorder_getOne', payload)
		} else {
			dispatch('preorder_infinityStart')
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
	preorder_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('preorder_lastOffsetSet', state.offset.current)
		commit('preorder_loadingBottomSet', true)
		api.preorders
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.preorder_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('preorder_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('preorder_loadingSet', false)
				commit('preorder_loadingBottomSet', false)
				commit('preorder_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	preorder_infinityStart({ commit, dispatch, state, getters }){
		commit('preorder_lastOffsetSet', 0)
		commit('preorder_loadingBottomSet', true)
		commit('preorder_loadingSet', true)
		api.preorders
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.preorder_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('preorder_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('preorder_loadingBottomSet', false)
				commit('preorder_loadingSet', false)
				commit('preorder_currentOffsetSet')
			})
	},
	preorder_getOne({ commit, dispatch }, payload){
		commit('preorder_loadingOneSet', true)
		api.preorders
			.getOne(payload)
			.then(({ data }) => {
				commit('preorder_currentSet', data)
				commit('preorder_loadingOneSet', false)
			})
	},
	preorder_getStatuses({ commit, dispatch }, payload){
		commit('preorder_loadingStatusesSet', true)
		api.preorders
			.getStatuses(payload)
			.then(({ data }) => {
				commit('preorder_cachedStatusesSet', data)
				commit('preorder_loadingStatusesSet', false)
			})
	},
}

const mutations = {
	preorder_cacheSet: (state, payload) => state.cached.list = payload,
	preorder_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	preorder_filtersSet: (store, payload) => store.filters = payload,
	preorder_sortSet: (store, payload) => store.sort = payload,
	preorder_lastOffsetSet: (store, payload) => store.offset.last = payload,
	preorder_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	preorder_currentSet: (store, payload) => store.cached.current = payload,
	preorder_currentTaskUpdate: (store, payload) => api.core.assignItem(store.cached.current.tasks, payload),
	preorder_currentContctAdd: (store, payload) => store.cached.current.contactFaces.push(payload),
	preorder_currentContctUpdate: (store, payload) => api.core.assignItem(store.cached.current.contactFaces, payload),
	preorder_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	preorder_cachedStatusesSet: (store, payload) => store.cached.statuses = payload,
	preorder_loadingSet: (store, payload) => store.loading.list = payload,
	preorder_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	preorder_loadingOneSet: (store, payload) => store.loading.one = payload,
	preorder_loadingStatusesSet: (store, payload) => store.loading.statuses = payload
}

const getters = {
	preorder_filters: ({ filters }) => filters,
	preorder_current: ({ cached }) => cached.current,
	preorder_cached: ({ cached }) => cached.list,
	preorder_statuses: ({ cached }) => cached.statuses,
	preorder_loading: ({ loading }) => loading.list,
	preorder_loadingBottom: ({ loading }) => loading.bottom,
	preorder_loadingOne: ({ loading }) => loading.one,
	preorder_acceptedAdd: state => state.filters && state.filters.phone && state.filters.phone.length && !state.loading.list
}

export default {
	state,
	actions,
	mutations,
	getters
}
