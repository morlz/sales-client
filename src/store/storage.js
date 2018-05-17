import api from '@/api'
import Infinite from '@/lib/Infinite'
import TwoSideInfinite from '@/lib/Infinite/TwoSideInfinite'
import merge from 'lodash.merge'
import { Furniture } from '@/lib'

let infinite = new TwoSideInfinite({ method: api.storages.getLimited, namespace: 'storage', returns: Furniture })

const state = merge(infinite.getState(), {
	cached: {
		current: {},
		models: []
	},
	loading: {
		one: true,
		models: true,
		bottom: false
	}
})

const actions = merge(infinite.getActions(true), {
	async storage_init ({ commit, dispatch, getters, state }, payload) {
		if (payload)
			return dispatch('storage_getOne', payload)

		dispatch('storage_initInfinite')
		state.infinite.additional = { type: "sgp" }
		dispatch('storage_getModels', { type: "sgp" })
		await state.infinite.start(api.scrollPosition.current.offset)
	},
	async storage_sortChange({ commit, dispatch, state }, payload){
		commit("storage_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async storage_filtersChange({ commit, dispatch, state }, payload){
		commit("storage_filtersSet", payload)
		state.infinite.filters = { ...payload, type: undefined }
		state.infinite.additional = { type: payload.type }
		await state.infinite.start()
	},
	async storage_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
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
	},
	async storage_addToCart({ commit, dispatch }, payload) {
		if ( !await dispatch('cart_addItem', { type: 'exist', un: payload.UN }) ) return
		commit('storage_removeOneFromCache', payload)
	},
})

const mutations = merge(infinite.getMutations(true), {
	storage_destroy: state => state.cached.models = state.cached.list = [],
	storage_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	storage_filtersSet: (state, payload) => state.filters = payload,
	storage_sortSet: (state, payload) => state.sort = payload,
	storage_lastOffsetSet: (state, payload) => state.offset.last = payload,
	storage_removeOneFromCache: (state, payload) => state.cached.list = state.cached.list.filter(el => el.UN != (payload.UN || payload)),
	storage_currentSet: (state, payload) => state.cached.current = payload,
	storage_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	storage_cachedModelsSet: (state, payload) => state.cached.models = payload,
	storage_loadingSet: (state, payload) => state.loading.list = payload,
	storage_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	storage_loadingOneSet: (state, payload) => state.loading.one = payload,
	storage_loadingModelsSet: (state, payload) => state.loading.models = payload,
	storage_initInfinite: (state, payload) => state.infinite = payload,
})

const getters = merge(infinite.getGetters(true), {
	storage_filters: state => ({ ...state.filters, type: undefined }),
	storage_current: state => state.cached.current,
	storage_cached: state => state.cached.list,
	storage_models: ({ cached }) => [
			{ MODEL: "Все модели", value: '', count: cached.models.reduce((prev, el) => prev += (+el.count), 0) },
			...cached.models.map(model => ({ MODEL: model.MODEL, value: model.MODEL, count: model.count }))
		]
		.sort(api.core.sortFnFactory(model => model.value == '' ? "_": model.MODEL, true)),
	storage_type: state => state.filters.type,
	storage_loading: state => state.loading.list,
	storage_loadingBottom: state => state.loading.bottom,
	storage_loadingOne: state => state.loading.one,
	storage_loadingModels: state => state.loading.models,
	storage_complete: state => state.complete
})

export default {
	state,
	actions,
	mutations,
	getters
}
