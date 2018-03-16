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
	},
	loading: {
		list: true,
		one: true,
		bottom: false
	}
}

const actions = {
	async shipment_init ({ commit, dispatch, getters, state }, payload) {
		let ID_SALONA = state.filters['salon.ID_SALONA'] !== undefined ?
									state.filters['salon.ID_SALONA']
								:	getters.auth_currentSalon.ID_SALONA + ""

		let filters = {
			'salon.ID_SALONA' : ID_SALONA
		}

		dispatch('salon_getList', getters.currentUserSalon)
		if (payload) {
			await dispatch('shipment_getOne', payload)
		} else {
			commit('shipment_initInfinite', new Infinite({
				method: api.shipments.getLimited,
				filters
			}))

			state.infinite.on('cached', n => commit('shipment_cacheSet', n))
			state.infinite.on('complete', n => commit('shipment_completeSet', n))

			commit('shipment_filtersSet', {
				...state.filters,
				...filters
			 })
			await state.infinite.start()
		}
	},
	async shipment_sortChange({ commit, dispatch }, payload){
		commit("shipment_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async shipment_filtersChange({ commit, dispatch }, payload){
		commit("shipment_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async shipment_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
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
	shipment_currentOffsetSet: (store, payload) => store.offset.current = payload !== undefined ? payload : store.cached.list.length,
	shipment_loadingSet: (store, payload) => store.loading.list = payload,
	shipment_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	shipment_loadingOneSet: (store, payload) => store.loading.one = payload,
	shipment_completeSet: (state, payload) => state.complete = payload,
	shipment_initInfinite: (state, payload) => state.infinite = payload,
}

const getters = {
	shipment_filters: state => state.filters,
	shipment_current: state => state.cached.current,
	shipment_cached: state => state.cached.list,
	shipment_loading: state => state.loading.list,
	shipment_loadingBottom: state => state.loading.bottom,
	shipment_loadingOne: state => state.loading.one,
	shipment_complete: state => state.complete
}

export default {
	state,
	actions,
	mutations,
	getters
}
