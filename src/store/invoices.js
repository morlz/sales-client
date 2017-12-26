import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: true,
		bottom: false
	}
}

const actions = {
	invoice_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('invoice_getOne', payload)
		} else {
			dispatch('invoice_infinityStart')
		}
	},
	invoice_sortChange({ commit, dispatch }, payload){
		commit("invoice_sortSet", payload)
		dispatch('invoice_infinityStart')
	},
	invoice_filtersChange({ commit, dispatch }, payload){
		commit("invoice_filtersSet", payload)
		dispatch('invoice_infinityStart')
	},
	invoice_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('invoice_lastOffsetSet', state.offset.current)
		commit('invoice_loadingBottomSet', true)
		api.invoices
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.invoice_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('invoice_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('invoice_loadingSet', false)
				commit('invoice_loadingBottomSet', false)
				commit('invoice_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	invoice_infinityStart({ commit, dispatch, state, getters }){
		commit('invoice_lastOffsetSet', -1)
		commit('invoice_loadingBottomSet', true)
		commit('invoice_loadingSet', true)
		api.invoices
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.invoice_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('invoice_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('invoice_loadingBottomSet', false)
				commit('invoice_loadingSet', false)
				commit('invoice_currentOffsetSet')
			})
	},
	invoice_getOne({ commit, dispatch }, payload){
		commit('invoice_loadingOneSet', true)
		api.invoices
			.getOne(payload)
			.then(({ data }) => {
				commit('invoice_currentSet', data)
				commit('invoice_loadingOneSet', false)
			})
	},
}

const mutations = {
	invoice_cacheSet: (state, payload) => state.cached.list = payload,
	invoice_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	invoice_filtersSet: (store, payload) => store.filters = payload,
	invoice_sortSet: (store, payload) => store.sort = payload,
	invoice_lastOffsetSet: (store, payload) => store.offset.last = payload,
	invoice_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	invoice_currentSet: (store, payload) => store.cached.current = payload,
	invoice_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	invoice_loadingSet: (store, payload) => store.loading.list = payload,
	invoice_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	invoice_loadingOneSet: (store, payload) => store.loading.one = payload,
}

const getters = {
	invoice_filters: ({ filters }) => filters,
	invoice_current: ({ cached }) => cached.current,
	invoice_cached: ({ cached }) => cached.list,
	invoice_loading: ({ loading }) => loading.list,
	invoice_loadingBottom: ({ loading }) => loading.bottom,
	invoice_loadingOne: ({ loading }) => loading.one,
}

export default {
	state,
	actions,
	mutations,
	getters
}
