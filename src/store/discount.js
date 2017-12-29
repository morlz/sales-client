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
	discount_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('discount_getOne', payload)
		} else {
			dispatch('discount_infinityStart')
		}
	},
	discount_sortChange({ commit, dispatch }, payload){
		commit("discount_sortSet", payload)
		dispatch('discount_infinityStart')
	},
	discount_filtersChange({ commit, dispatch }, payload){
		commit("discount_filtersSet", payload)
		dispatch('discount_infinityStart')
	},
	discount_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('discount_lastOffsetSet', state.offset.current)
		commit('discount_loadingBottomSet', true)
		api.discounts
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.discount_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('discount_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('discount_loadingSet', false)
				commit('discount_loadingBottomSet', false)
				commit('discount_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	discount_infinityStart({ commit, dispatch, state, getters }){
		commit('discount_lastOffsetSet', -1)
		commit('discount_loadingBottomSet', true)
		commit('discount_loadingSet', true)
		api.discounts
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.discount_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('discount_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('discount_loadingBottomSet', false)
				commit('discount_loadingSet', false)
				commit('discount_currentOffsetSet')
			})
	},
	discount_getOne({ commit, dispatch }, payload){
		commit('discount_loadingOneSet', true)
		api.discounts
			.getOne(payload)
			.then(({ data }) => {
				commit('discount_currentSet', data)
				commit('discount_loadingOneSet', false)
			})
	}
}

const mutations = {
	discount_cacheSet: (state, payload) => state.cached.list = payload,
	discount_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	discount_filtersSet: (store, payload) => store.filters = payload,
	discount_sortSet: (store, payload) => store.sort = payload,
	discount_lastOffsetSet: (store, payload) => store.offset.last = payload,
	discount_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	discount_currentSet: (store, payload) => store.cached.current = payload,
	discount_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	discount_cachedModelsSet: (store, payload) => store.cached.models = payload,
	discount_loadingSet: (store, payload) => store.loading.list = payload,
	discount_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	discount_loadingOneSet: (store, payload) => store.loading.one = payload,
	discount_loadingModelsSet: (store, payload) => store.loading.models = payload
}

const getters = {
	discount_filters: ({ filters }) => filters,
	discount_current: ({ cached }) => cached.current,
	discount_cached: ({ cached }) => cached.list,
	discount_cachedByModel: (store) => {
		let models = []

		store.cached.list.forEach(el => {
			let model = models.find(m => m.model == el.model)
			if (model) {
				model.data.push(el)
			} else {
				models.push({
					model: el.model,
					data: [el]
				})
			}
		})

		return models
	},
	discount_models: ({ cached }) => cached.models,
	discount_loading: ({ loading }) => loading.list,
	discount_loadingBottom: ({ loading }) => loading.bottom,
	discount_loadingOne: ({ loading }) => loading.one,
	discount_loadingModels: ({ loading }) => loading.models,
}

export default {
	state,
	actions,
	mutations,
	getters
}
