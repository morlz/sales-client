import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
		models: []
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: true,
		models: true,
		bottom: false
	}
}

const actions = {
	furniture_init ({ commit, dispatch, getters }, payload) {
		dispatch('furniture_getModels', { type: getters.furniture_type })
		dispatch('getSalonsList', getters.currentUserSalon)
		if (payload) {
			dispatch('furniture_getOne', payload)
		} else {
			dispatch('furniture_infinityStart')
		}
	},
	furniture_sortChange({ commit, dispatch }, payload){
		commit("furniture_sortSet", payload)
		dispatch('furniture_infinityStart')
	},
	furniture_filtersChange({ commit, dispatch }, payload){
		commit("furniture_filtersSet", payload)
		dispatch('furniture_infinityStart')
	},
	async furniture_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('furniture_lastOffsetSet', state.offset.current)
		commit('furniture_loadingBottomSet', true)
		let res = await api.furnitures.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.furniture_filters,
			sort: state.sort,
			type: getters.furniture_type
		})
		if (res && res.data && res.data.error) return
		if (!res.data.error) {
			commit('furniture_cacheAppend', res.data)
			payload.loaded()
			if (!res.data || !res.data.length) payload.complete ()
		}
		commit('furniture_loadingSet', false)
		commit('furniture_loadingBottomSet', false)
		commit('furniture_currentOffsetSet')
	},
	async furniture_infinityStart({ commit, dispatch, state, getters }){
		commit('furniture_lastOffsetSet', 0)
		commit('furniture_loadingBottomSet', true)
		commit('furniture_loadingSet', true)
		let res = await api.furnitures.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.furniture_filters,
			sort: state.sort,
			type: getters.furniture_type
		})
		if (!res.data.error) commit('furniture_cacheSet', res.data)
		if (res.data.error) dispatch('catchErrorNotify', res.data.error)
		commit('furniture_loadingBottomSet', false)
		commit('furniture_loadingSet', false)
		commit('furniture_currentOffsetSet')
	},
	async furniture_getOne({ commit, dispatch }, payload){
		commit('furniture_loadingOneSet', true)
		let res = await api.furnitures.getOne(payload)
		if (res.data.error) return
		commit('furniture_currentSet', res.data)
		commit('furniture_loadingOneSet', false)
	},
	async furniture_getModels({ commit, dispatch }, payload){
		commit('furniture_loadingModelsSet', true)
		let res = await api.furnitures.getModels(payload)
		if (res.data.error) return
		commit('furniture_cachedModelsSet', res.data)
		commit('furniture_loadingModelsSet', false)
	},
	async furniture_addToCart({ commit, dispatch }, payload) {
		if ( !await dispatch('cart_addItem', { type: 'exist', un: payload.UN }) ) return
		commit('furniture_removeOneFromCache', payload)
	}
}

const mutations = {
	furniture_cacheSet: (state, payload) => state.cached.list = payload,
	furniture_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	furniture_filtersSet: (store, payload) => store.filters = payload,
	furniture_sortSet: (store, payload) => store.sort = payload,
	furniture_lastOffsetSet: (store, payload) => store.offset.last = payload,
	furniture_removeOneFromCache: (store, payload) => store.cached.list = store.cached.list.filter(el => el.UN != (payload.UN || payload)),
	furniture_currentSet: (store, payload) => store.cached.current = payload,
	furniture_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	furniture_cachedModelsSet: (store, payload) => store.cached.models = payload,
	furniture_loadingSet: (store, payload) => store.loading.list = payload,
	furniture_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	furniture_loadingOneSet: (store, payload) => store.loading.one = payload,
	furniture_loadingModelsSet: (store, payload) => store.loading.models = payload
}

const getters = {
	furniture_filters: ({ filters }) => ({ ...filters, type: undefined }),
	furniture_type: ({ filters }) => filters.type,
	furniture_current: ({ cached }) => cached.current,
	furniture_cached: ({ cached }) => cached.list,
	furniture_models: ({ cached }) => [
			{ MODEL: "Все модели", value: "", count: cached.models.reduce((prev, el) => prev += (+el.count), 0) },
			...cached.models.map(model => ({ MODEL: model.MODEL, value: model.MODEL, count: model.count }))
		]
		.sort(api.core.sortFnFactory(model => model.value == "" ? "_": model.MODEL, true)),
	furniture_loading: ({ loading }) => loading.list,
	furniture_loadingBottom: ({ loading }) => loading.bottom,
	furniture_loadingOne: ({ loading }) => loading.one,
	furniture_loadingModels: ({ loading }) => loading.models,
}

export default {
	state,
	actions,
	mutations,
	getters
}
