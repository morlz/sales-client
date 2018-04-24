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
		models: []
	},
	loading: {
		list: true,
		one: true,
		models: true,
		bottom: false
	}
}

const actions = {
	async discount_init ({ commit, dispatch, state, getters }, payload) {
		let ID_SALONA = state.filters['td.salon.ID_SALONA'] !== undefined ?
							state.filters['td.salon.ID_SALONA']
						:	"1040"

		let NAKC = state.filters['td.salon.ID_SALONA'] == "1040" ?
							"65536"
						:	undefined

		let filters = {
			'td.salon.ID_SALONA': ID_SALONA,
			'NAKC': NAKC
		}

		commit('discount_initInfinite', new Infinite({
			method: api.discounts.getLimited,
			filters
		}))

		dispatch('salon_getList')

		state.infinite.on('cached', n => commit('discount_cacheSet', n))
		state.infinite.on('complete', n => commit('discount_completeSet', n))

		if (payload) {
			await dispatch('discount_getOne', payload)
		} else {
			dispatch('discount_getModels', { filters })
			commit('discount_filtersSet', {
				...state.filters,
				...filters
			})
			await state.infinite.start()
		}
	},
	async discount_sortChange({ commit, dispatch, state }, payload){
		commit("discount_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async discount_filtersChange({ commit, dispatch, state }, payload){
		commit("discount_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async discount_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
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
	discount_destroy: state => state.cached.list = [],
	discount_cacheSet: (state, payload) => state.cached.list = payload,
	discount_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	discount_filtersSet: (state, payload) => state.filters = payload,
	discount_sortSet: (state, payload) => state.sort = payload,
	discount_lastOffsetSet: (state, payload) => state.offset.last = payload,
	discount_removeOneFromCache: (state, payload) => state.cached.list = state.cached.list.filter(el => el.UN != (payload.UN || payload)),
	discount_currentSet: (state, payload) => state.cached.current = payload,
	discount_currentOffsetSet: (state, payload) => state.offset.current = payload || state.cached.list.length,
	discount_cachedModelsSet: (state, payload) => state.cached.models = payload,
	discount_loadingSet: (state, payload) => state.loading.list = payload,
	discount_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	discount_loadingOneSet: (state, payload) => state.loading.one = payload,
	discount_loadingModelsSet: (state, payload) => state.loading.models = payload,
	discount_completeSet: (state, payload) => state.complete = payload,
	discount_initInfinite: (state, payload) => state.infinite = payload,
}

const getters = {
	discount_filters: state => ({ ...state.filters, 'NAKC': state.filters['td.salon.ID_SALONA'] == '1040' ? '65536' : undefined}),
	discount_current: ({ cached }) => cached.current,
	discount_cached: ({ cached }) => cached.list,
	discount_cachedByModel: (state) => {
		let models = []

		state.cached.list.forEach(el => {
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
	discount_complete: state => state.complete
}

export default {
	state,
	actions,
	mutations,
	getters
}
