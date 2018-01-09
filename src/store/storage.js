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
	storage_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('storage_getOne', payload)
		} else {
			dispatch('storage_infinityStart')
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
	storage_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('storage_lastOffsetSet', state.offset.current)
		commit('storage_loadingBottomSet', true)
		api.storages
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.storage_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('storage_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('storage_loadingSet', false)
				commit('storage_loadingBottomSet', false)
				commit('storage_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	storage_infinityStart({ commit, dispatch, state, getters }){
		commit('storage_lastOffsetSet', 0)
		commit('storage_loadingBottomSet', true)
		commit('storage_loadingSet', true)
		api.storages
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.storage_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('storage_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('storage_loadingBottomSet', false)
				commit('storage_loadingSet', false)
				commit('storage_currentOffsetSet')
			})
	},
	storage_getOne({ commit, dispatch }, payload){
		commit('storage_loadingOneSet', true)
		api.storages
			.getOne(payload)
			.then(({ data }) => {
				commit('storage_currentSet', data)
				commit('storage_loadingOneSet', false)
			})
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
	storage_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	storage_cachedModelsSet: (store, payload) => store.cached.models = payload,
	storage_loadingSet: (store, payload) => store.loading.list = payload,
	storage_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	storage_loadingOneSet: (store, payload) => store.loading.one = payload,
	storage_loadingModelsSet: (store, payload) => store.loading.models = payload
}

const getters = {
	storage_filters: ({ filters }) => filters,
	storage_current: ({ cached }) => cached.current,
	storage_cached: ({ cached }) => cached.list,
	storage_models: ({ cached }) => cached.models,
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
