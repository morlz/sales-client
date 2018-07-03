import api from '@/api'
import Infinite from '@/lib/Infinite'
import groupBy from 'lodash.groupby'

const state = {
	infinite: {},
	complete: {},
	cached: {},
	query: {},
	kat: {}
}

const actions = {
	furniture_selectCloth_init ({ commit, dispatch, rootState, rootGetters }, index) {
		commit('furniture_selectCloth_cacheSet', { [index]: [] })
		commit('furniture_selectCloth_querySet', { [index]: '' })
		commit('furniture_selectCloth_katSet', { [index]: null })
		let infinite = new Infinite({
			method: api.furnitures.getNewCloth,
			additional: {
				id: rootState.furniture.new.selected.model,
				config_id: rootGetters.furniture_clothSelectForm_type,
				index,
				stock_id: rootState.furniture.new.cached.stock ? rootState.furniture.new.cached.stock : null,
			}
		})

		infinite.on('cached', n => commit('furniture_selectCloth_cacheSet', { [index]: n }))
		infinite.on('complete', n => commit('furniture_selectCloth_completeSet', { [index]: n }))

		commit('furniture_selectCloth_infiniteSet', { [index]: infinite })
		dispatch('furniture_selectCloth_start', index)
	},
	furniture_selectCloth_destroy ({ commit, dispatch }, index) {
		commit('furniture_selectCloth_querySet', { [index]: undefined })
		commit('furniture_selectCloth_katSet', { [index]: undefined })
		commit('furniture_selectCloth_cacheSet', { [index]: undefined })
		commit('furniture_selectCloth_infiniteSet', { [index]: undefined })
	},
	async furniture_selectCloth_start ({ commit, dispatch, state, rootGetters }, index) {
		state.infinite[index].additional = {
			...state.infinite[index].additional,
			query: state.query[index],
			kat: state.kat[index] || null,
			config_id: rootGetters.furniture_clothSelectForm_type,
		}

		await state.infinite[index].start()
	},
	async furniture_selectCloth_infinite ({ commit, dispatch }, { index, payload }) {
		await state.infinite[index].more(payload)
	},
}

const mutations = {
	furniture_selectCloth_infiniteSet: (state, payload) => state.infinite = { ...state.infinite, ...payload },
	furniture_selectCloth_completeSet: (state, payload) => state.complete = { ...state.complete, ...payload },
	furniture_selectCloth_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	furniture_selectCloth_querySet: (state, payload) => state.query = { ...state.query, ...payload },
	furniture_selectCloth_katSet: (state, payload) => state.kat = { ...state.kat, ...payload },
	furniture_selectCloth_cacheAppend: (state, payload) => Object.keys(payload).map(key => state.cached[key] = [...state.cached[key], ...payload[key]]),
}

const getters = {
	furniture_selectCloth_cached: state => Object.keys(state.cached).map(index => groupBy(state.cached[index], 'collection')),
	furniture_selectCloth_kats: state => state.kat,
	furniture_selectCloth_complete: state => state.complete,
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
