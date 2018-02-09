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
	async shipment_init ({ commit, dispatch, getterss }, payload) {
		dispatch('getSalonsList', getters.currentUserSalon)
		if (payload) {
			await dispatch('shipment_getOne', payload)
		} else {
			await dispatch('shipment_infinityStart')
		}
	},
	async shipment_sortChange({ commit, dispatch }, payload){
		commit("shipment_sortSet", payload)
		await dispatch('shipment_infinityStart')
	},
	async shipment_filtersChange({ commit, dispatch }, payload){
		commit("shipment_filtersSet", payload)
		await dispatch('shipment_infinityStart')
	},
	async shipment_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) {
			setTimeout(a => payload.loaded(), 5e2)
			return
		}
		commit('shipment_lastOffsetSet', state.offset.current)
		commit('shipment_loadingBottomSet', true)
		let res = await api.shipments.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.shipment_filters,
			sort: state.sort
		})
		commit('shipment_loadingSet', false)
		commit('shipment_loadingBottomSet', false)
		payload.loaded()
		if (res.data && res.data.error) return
		commit('shipment_cacheAppend', res.data)
		commit('shipment_currentOffsetSet')
		if (!res.data.length) payload.complete ()
	},
	async shipment_infinityStart({ commit, dispatch, state, getters }){
		commit('shipment_lastOffsetSet', 0)
		commit('shipment_loadingBottomSet', true)
		commit('shipment_loadingSet', true)
		let res = await api.shipments .getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.shipment_filters,
			sort: state.sort
		})
		commit('shipment_loadingBottomSet', false)
		commit('shipment_loadingSet', false)
		if (res.data && res.data.error) return
		commit('shipment_cacheSet', res.data)
		commit('shipment_currentOffsetSet')
	},
	async shipment_getOne({ commit, dispatch }, payload){
		commit('shipment_loadingOneSet', true)
		let res = await api.shipments.getOne(payload)
		commit('shipment_loadingOneSet', false)
		if (res.data && res.data.error) return
		commit('shipment_currentSet', res.data)
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
	shipment_filters: state => state.filters,
	shipment_current: state => state.cached.current,
	shipment_cached: state => state.cached.list,
	shipment_loading: state => state.loading.list,
	shipment_loadingBottom: state => state.loading.bottom,
	shipment_loadingOne: state => state.loading.one,
}

export default {
	state,
	actions,
	mutations,
	getters
}
