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
	},
	new: {
		clothSearch: {
			'1' : '',
			'2' : '',
			'3' : '',
		},
		selected: {
			model: "",
			type: "",
			dekor: "",
			cloth: {
				'1': '',
				'2': '',
				'3': '',
			},
		},
		cached: {
			models: [],
			stock: {},
			types: [],
			dekor: [],
			cat: "",
			cloth: {
				'1': '',
				'2': '',
				'3': '',
			},

		},
		loading: {
			models: false,
			types: false,
			dekor: false,
			cat: false,
			cloth: {
				'1': false,
				'2': false,
				'3': false,
			}
		}
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
	},
	async furniture_new_init ({ commit, dispatch, state }) {
		if (!state.new.cached.models.length)
			dispatch('furniture_new_getModels')
	},
	async furniture_new_getModels ({ commit, dispatch }) {
		commit('furniture_new_loadingModelsSet', true)
		let res = await api.furnitures.getNewModels()
		commit('furniture_new_loadingModelsSet', false)
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedModelsSet', res.data)
	},
	async furniture_new_getTypes ({ commit, dispatch, state, getters }) {
		commit('furniture_new_loadingTypesSet', true)
		let res = await api.furnitures.getNewTypes(state.new.selected.model, getters.furniture_new_freeTrim)
		commit('furniture_new_loadingTypesSet', false)
		if (res && res.data && res.data.error) return
		let { stock, types } = res.data
		commit('furniture_new_cachedStockSet', stock)
		commit('furniture_new_cachedTypesSet', types)
	},
	async furniture_new_getDekor ({ commit, dispatch, state }) {
		commit('furniture_new_loadingDekorSet', true)
		let res = await api.furnitures.getNewDekor(state.new.selected.model)
		commit('furniture_new_loadingDekorSet', false)
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedDekorSet', res.data)
	},
	async furniture_new_getCat ({ commit, dispatch, state }) {
		commit('furniture_new_loadingCatSet', true)
		let res = await api.furnitures.getNewCat(state.new.selected.model)
		commit('furniture_new_loadingCatSet', false)
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedCatSet', res.data)
	},
	async furniture_new_getCloth ({ commit, dispatch, state }, index){
		if (state.new.clothSearch[index].length < 4) return
		commit('furniture_new_loadingClothSet', { index, data: true })
		let res = await api.furnitures.getNewCloth({
			query: state.new.clothSearch[index],
			id: state.new.selected.model,
			index: index - 1, // 1 2 3 => 0 1 2
			stock_id: state.new.cached.stock ? state.new.cached.stock : null
		})
		commit('furniture_new_loadingClothSet', { index, data: false })
		if (res && res.data && res.data.error) return
		commit('furniture_new_cachedClothSet', { index, data: res.data })
	},
	furniture_new_modelSelect ({ commit, dispatch, getters }, payload) {
		commit('furniture_new_modelSelect', payload)
		commit('furniture_new_dekorSelect', '')
		commit('furniture_new_typeSelect', getters.furniture_new_freeTrim ? [] : '')
		dispatch('furniture_new_getTypes')
		dispatch('furniture_new_getDekor')
	},
	furniture_new_typeSelect ({ commit, dispatch, getters }, payload) {
		commit('furniture_new_typeSelect', payload)
		if (getters.furniture_new_freeTrim) return
		commit('furniture_new_dekorSelect', '')
		dispatch('furniture_new_getDekor')
	},
	furniture_new_dekorSelect ({ commit, dispatch }, payload) {
		commit('furniture_new_dekorSelect', payload)
	},
	furniture_new_clothSearch ({ commit, dispatch }, { index, data }) {
		commit('furniture_new_clothSearch', { index, data })
		dispatch('furniture_new_getCloth', index)
	},
	furniture_new_clothSelect ({ commit, dispatch }, payload) {
		commit('furniture_new_clothSelect', payload)
	},
}

const mutations = {
	furniture_cacheSet: (state, payload) => state.cached.list = payload,
	furniture_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	furniture_filtersSet: (state, payload) => state.filters = payload,
	furniture_sortSet: (state, payload) => state.sort = payload,
	furniture_lastOffsetSet: (state, payload) => state.offset.last = payload,
	furniture_removeOneFromCache: (state, payload) => state.cached.list = state.cached.list.filter(el => el.UN != (payload.UN || payload)),
	furniture_currentSet: (state, payload) => state.cached.current = payload,
	furniture_currentOffsetSet: (state, payload) => state.offset.current = payload || state.cached.list.length,
	furniture_cachedModelsSet: (state, payload) => state.cached.models = payload,
	furniture_loadingSet: (state, payload) => state.loading.list = payload,
	furniture_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	furniture_loadingOneSet: (state, payload) => state.loading.one = payload,
	furniture_loadingModelsSet: (state, payload) => state.loading.models = payload,
	furniture_new_cachedModelsSet: (state, payload) => state.new.cached.models = payload,
	furniture_new_cachedStockSet: (state, payload) => state.new.cached.stock = payload,
	furniture_new_cachedTypesSet: (state, payload) => state.new.cached.types = payload,
	furniture_new_cachedDekorSet: (state, payload) => state.new.cached.dekor = payload,
	furniture_new_cachedClothSet: (state, payload) => state.new.cached.cloth[payload.index] = payload.data,
	furniture_new_loadingModelsSet: (state, payload) => state.new.loading.models = payload,
	furniture_new_loadingTypesSet: (state, payload) => state.new.loading.types = payload,
	furniture_new_loadingDekorSet: (state, payload) => state.new.loading.dekor = payload,
	furniture_new_loadingCatSet: (state, payload) => state.new.loading.cat = payload,
	furniture_new_loadingClothSet: (state, payload) => state.new.loading.cloth[payload.index] = payload.data,
	furniture_new_modelSelect: (state, payload) => state.new.selected.model = payload,
	furniture_new_typeSelect: (state, payload) => state.new.selected.type = payload,
	furniture_new_dekorSelect: (state, payload) => state.new.selected.dekor = payload,
	furniture_new_clothSelect: (state, payload) => state.new.selected.cloth[payload.index] = payload.data,
	furniture_new_clothSearch: (state, payload) => state.new.clothSearch[payload.index] = payload.data,
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
	furniture_new_loading: state => state.new.loading,
	furniture_new_cached: state => state.new.cached,
	furniture_new_selected: state => state.new.selected,
	furniture_new_active: state => {
		let currentStep = 0

		if (state.new.selected.model.length)
			currentStep++

		if (state.new.selected.type.length || (!state.new.cached.types.length && !state.new.loading.types && currentStep > 0))
			currentStep++

		if (state.new.selected.dekor.length || (!state.new.cached.dekor.length && !state.new.loading.dekor && currentStep > 1))
			currentStep++

		return {
			currentStep,
			model: currentStep < 0,
			type: currentStep < 1 || (!state.new.cached.types.length && !state.new.loading.types && currentStep > 0),
			dekor: currentStep < 2 || (!state.new.cached.dekor.length && !state.new.loading.dekor && currentStep > 1),
			cloth: {
				'1': currentStep < 3,
				'2': currentStep < 3,
				'3': currentStep < 3,
			}
		}
	},
	furniture_new_freeTrim: state => state.new.selected.model ? !!+state.new.cached.models.find(el => el.ITEMID == state.new.selected.model).CRFREETRIM : false,
}

export default {
	state,
	actions,
	mutations,
	getters
}
