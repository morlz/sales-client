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
	async storage_init ({ commit, dispatch, getters }, payload) {
		dispatch('storage_getModels', { type: getters.storage_type })
		if (payload) {
			dispatch('storage_getOne', payload)
		} else {
			await dispatch('storage_infinityStart')
		}
	},
	storage_sortChange({ commit, dispatch }, payload){
		commit("storage_sortSet", payload)
		dispatch('storage_infinityStart')
	},
	storage_filtersChange({ commit, dispatch }, payload){
		commit("storage_filtersSet", payload)
		dispatch('storage_infinityStart')
	},
	async storage_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return

		commit('storage_lastOffsetSet', state.offset.current)
		commit('storage_loadingBottomSet', true)
		let res = await api.storages.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.storage_filters,
			sort: state.sort,
			type: getters.storage_type
		})
		commit('storage_loadingSet', false)
		commit('storage_loadingBottomSet', false)
		if (!res.data || res.data.error) return

		commit('storage_cacheAppend', res.data)
		commit('storage_currentOffsetSet')
		payload.loaded()
		if (!res.data.length)
			payload.complete()
	},
	async storage_infinityStart({ commit, dispatch, state, getters }){
		commit('storage_lastOffsetSet', 0)
		commit('storage_currentOffsetSet', 0)
		commit('storage_loadingBottomSet', true)
		commit('storage_loadingSet', true)
		let res = await api.storages.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.storage_filters,
			sort: state.sort,
			type: getters.storage_type
		})
		commit('storage_loadingBottomSet', false)
		commit('storage_loadingSet', false)
		if (!res.data || res.data.error) return

		commit('storage_cacheSet', res.data)
		commit('storage_currentOffsetSet')
	},
	async storage_getOne({ commit, dispatch }, payload){
		commit('storage_loadingOneSet', true)
		let res = await api.storages.getOne(payload)
		commit('storage_loadingOneSet', false)
		if (!res.data || res.data.error) return

		commit('storage_currentSet', res.data)
	},
	async storage_getModels({ commit, dispatch }, payload){
		commit('storage_loadingModelsSet', true)
		let res = await api.storages.getModels(payload)
		commit('storage_loadingModelsSet', false)
		if (!res.data || res.data.error) return

		commit('storage_cachedModelsSet', res.data)
	}
}

const mutations = {
	storage_cacheSet: (state, payload) => state.cached.list = payload,
	storage_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	storage_filtersSet: (store, payload) => store.filters = payload,
	storage_sortSet: (store, payload) => store.sort = payload,
	storage_lastOffsetSet: (store, payload) => store.offset.last = payload,
	storage_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	storage_currentSet: (store, payload) => store.cached.current = payload,
	storage_currentOffsetSet: (store, payload) => store.offset.current = payload !== undefined ? payload : store.cached.list.length,
	storage_cachedModelsSet: (store, payload) => store.cached.models = payload,
	storage_loadingSet: (store, payload) => store.loading.list = payload,
	storage_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	storage_loadingOneSet: (store, payload) => store.loading.one = payload,
	storage_loadingModelsSet: (store, payload) => store.loading.models = payload
}

const getters = {
	storage_filters: ({ filters }) => ({ ...filters, type: undefined }),
	storage_current: ({ cached }) => cached.current,
	storage_cached: ({ cached }) => cached.list,
	storage_models: ({ cached }) => [
			{ MODEL: "Все модели", value: "", count: cached.models.reduce((prev, el) => prev += (+el.count), 0) },
			...cached.models.map(model => ({ MODEL: model.MODEL, value: model.MODEL, count: model.count }))
		]
		.sort(api.core.sortFnFactory(model => model.value == "" ? "АААААА": model.MODEL, true)),
	storage_type: ({ filters }) => filters.type,
	storage_loading: ({ loading }) => loading.list,
	storage_loadingBottom: ({ loading }) => loading.bottom,
	storage_loadingOne: ({ loading }) => loading.one,
	storage_loadingModels: ({ loading }) => loading.models,
}

export default {
	state,
	actions,
	mutations,
	getters
}
