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
		dispatch('furniture_getModels', { salon: null, type: "storage" })
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
	furniture_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('furniture_lastOffsetSet', state.offset.current)
		commit('furniture_loadingBottomSet', true)
		api.furnitures
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.furniture_filters,
				sort: state.sort,
				type: getters.furniture_type
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('furniture_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('furniture_loadingSet', false)
				commit('furniture_loadingBottomSet', false)
				commit('furniture_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	furniture_infinityStart({ commit, dispatch, state, getters }){
		commit('furniture_lastOffsetSet', 0)
		commit('furniture_loadingBottomSet', true)
		commit('furniture_loadingSet', true)
		api.furnitures
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.furniture_filters,
				sort: state.sort,
				type: getters.furniture_type
			})
			.then(({ data }) => {
				if (!data.error) commit('furniture_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('furniture_loadingBottomSet', false)
				commit('furniture_loadingSet', false)
				commit('furniture_currentOffsetSet')
			})
	},
	furniture_getOne({ commit, dispatch }, payload){
		commit('furniture_loadingOneSet', true)
		api.furnitures
			.getOne(payload)
			.then(({ data }) => {
				commit('furniture_currentSet', data)
				commit('furniture_loadingOneSet', false)
			})
	},
	furniture_getModels({ commit, dispatch }, payload){
		commit('furniture_loadingModelsSet', true)
		api.furnitures
			.getModels(payload)
			.then(({ data }) => {
				commit('furniture_cachedModelsSet', data)
				commit('furniture_loadingModelsSet', false)
			})
	},
}

const mutations = {
	furniture_cacheSet: (state, payload) => state.cached.list = payload,
	furniture_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	furniture_filtersSet: (store, payload) => store.filters = payload,
	furniture_sortSet: (store, payload) => store.sort = payload,
	furniture_lastOffsetSet: (store, payload) => store.offset.last = payload,
	furniture_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
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
	furniture_models: ({ cached }) => [ { MODEL: "Все модели", value: "", count: cached.models.reduce((prev, el) => prev += (+el.count), 0) }, ...cached.models.map(model => ({ MODEL: model.MODEL, value: model.MODEL, count: model.count }))],
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
