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
	shipment_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('shipment_getOne', payload)
		} else {
			dispatch('shipment_infinityStart')
		}
	},
	shipment_sortChange({ commit, dispatch }, payload){
		commit("shipment_sortSet", payload)
		dispatch('shipment_infinityStart')
	},
	shipment_filtersChange({ commit, dispatch }, payload){
		commit("shipment_filtersSet", payload)
		dispatch('shipment_infinityStart')
	},
	shipment_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('shipment_lastOffsetSet', state.offset.current)
		commit('shipment_loadingBottomSet', true)
		api.shipments
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.shipment_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('shipment_cacheAppend', data)
					payload.loaded ()
					if (!data.length) payload.complete ()
				}
				commit('shipment_loadingSet', false)
				commit('shipment_loadingBottomSet', false)
				commit('shipment_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	shipment_infinityStart({ commit, dispatch, state, getters }){
		commit('shipment_lastOffsetSet', 0)
		commit('shipment_loadingBottomSet', true)
		commit('shipment_loadingSet', true)
		api.shipments
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.shipment_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('shipment_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('shipment_loadingBottomSet', false)
				commit('shipment_loadingSet', false)
				commit('shipment_currentOffsetSet')
			})
	},
	shipment_getOne({ commit, dispatch }, payload){
		commit('shipment_loadingOneSet', true)
		api.shipments
			.getOne(payload)
			.then(({ data }) => {
				commit('shipment_currentSet', data)
				commit('shipment_loadingOneSet', false)
			})
	},
}

const mutations = {
	shipment_cacheSet: (state, payload) => state.cached.list = payload,
	shipment_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	shipment_filtersSet: (store, payload) => store.filters = payload,
	shipment_sortSet: (store, payload) => store.sort = payload,
	shipment_lastOffsetSet: (store, payload) => store.offset.last = payload,
	shipment_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	shipment_currentSet: (store, payload) => store.cached.current = payload,
	shipment_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	shipment_loadingSet: (store, payload) => store.loading.list = payload,
	shipment_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	shipment_loadingOneSet: (store, payload) => store.loading.one = payload,
}

const getters = {
	shipment_filters: ({ filters }) => filters,
	shipment_current: ({ cached }) => cached.current,
	shipment_cached: ({ cached }) => cached.list,
	shipment_loading: ({ loading }) => loading.list,
	shipment_loadingBottom: ({ loading }) => loading.bottom,
	shipment_loadingOne: ({ loading }) => loading.one,
}

export default {
	state,
	actions,
	mutations,
	getters
}
