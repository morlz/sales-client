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
	async discount_init ({ commit, dispatch }, payload) {
		dispatch('discount_getModels', {})
		dispatch('salon_getList', getters.currentUserSalon)
		if (payload) {
			await dispatch('discount_getOne', payload)
		} else {
			dispatch('salon_getList')
			await dispatch('discount_infinityStart')
		}
	},
	async discount_sortChange({ commit, dispatch }, payload){
		commit("discount_sortSet", payload)
		await dispatch('discount_infinityStart')
	},
	async discount_filtersChange({ commit, dispatch }, payload){
		commit("discount_filtersSet", payload)
		await dispatch('discount_infinityStart')
	},
	async discount_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current)
			return setTimeout(a => payload.loaded(), 5e2)

		commit('discount_lastOffsetSet', state.offset.current)
		commit('discount_loadingBottomSet', true)
		let res = await api.discounts.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.discount_filters,
			sort: state.sort
		})
		commit('discount_loadingBottomSet', false)
		commit('discount_loadingSet', false)
		if (!res.data || res.data.error) return

		commit('discount_cacheAppend', res.data)
		commit('discount_currentOffsetSet')
		payload.loaded()
		if (!res.data.length)
			payload.complete()
	},
	async discount_infinityStart({ commit, dispatch, state, getters }){
		commit('discount_lastOffsetSet', 0)
		commit('discount_currentOffsetSet', 0)
		commit('discount_loadingBottomSet', true)
		commit('discount_loadingSet', true)
		let res = await api.discounts.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.discount_filters,
			sort: state.sort
		})
		commit('discount_loadingBottomSet', false)
		commit('discount_loadingSet', false)
		if (!res.data || res.data.error) return

		commit('discount_cacheSet', res.data)
		commit('discount_currentOffsetSet')
	},
	async discount_getOne({ commit, dispatch }, payload){
		commit('discount_loadingOneSet', true)
		let res = await api.discounts.getOne(payload)
		commit('discount_loadingOneSet', false)
		if (!res.data || res.data.error) return

		commit('discount_currentSet', res.data)
	},
	async discount_getModels({ commit, dispatch }, payload){
		commit('discount_loadingModelsSet', true)
		let res = await api.discounts.getModels(payload)
		commit('discount_loadingModelsSet', false)
		if (!res.data || res.data.error) return

		commit('discount_cachedModelsSet', res.data)
	},
	async discount_addToCart({ commit, dispatch }, payload) {
		if ( !await dispatch('cart_addItem', { type: 'exist', un: payload.UN }) ) return
		commit('discount_removeOneFromCache', payload)
	},
}

const mutations = {
	discount_cacheSet: (state, payload) => state.cached.list = payload,
	discount_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	discount_filtersSet: (store, payload) => store.filters = payload,
	discount_sortSet: (store, payload) => store.sort = payload,
	discount_lastOffsetSet: (store, payload) => store.offset.last = payload,
	discount_removeOneFromCache: (store, payload) => store.cached.list = state.cached.list.filter(el => el.UN != (payload.UN || payload)),
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
			let model = models.find(m => m.model == el.MODEL)
			if (model) {
				model.data.push(el)
			} else {
				models.push({
					model: el.MODEL,
					data: [el]
				})
			}
		})

		return models
	},
	discount_models: ({ cached }) => [
			{ MODEL: "Все модели", value: "", count: cached.models.reduce((prev, el) => prev += (+el.count), 0) },
			...cached.models.map(model => ({ MODEL: model.MODEL, value: model.MODEL, count: model.count }))
		]
		.sort(api.core.sortFnFactory(model => model.value == "" ? "АААААА": model.MODEL, true)),
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
