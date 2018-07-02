import api from '@/api'
import TwoSideInfinite from '@/lib/Infinite/TwoSideInfinite'
import merge from 'lodash.merge'
import { Visitor } from '@/lib'

let infinite = new TwoSideInfinite({ method: api.visitors.getLimited, namespace: 'visitor', returns: Visitor })

const state = merge(infinite.getState(), {
	loading: {
		add: false
	}
})

const actions = merge(infinite.getActions(true), {
	async visitor_init ({ commit, dispatch, state }, payload) {
		if (+payload)
			return await dispatch('visitor_getOne', payload)

		dispatch('visitor_initInfinite')
		await state.infinite.start(api.scrollPosition.current.offset)
	},
	visitor_destroy ({ commit, dispatch }) {
		commit('visitor_destroy')
		commit('visitor_infiniteDestroy')
	},
	async visitor_sortChange({ commit, dispatch }, payload){
		commit("visitor_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async visitor_filtersChange({ commit, dispatch, getters }, payload){
		commit("visitor_filtersSet", payload)
		state.infinite.filters = { ...payload, type: undefined }
		state.infinite.additional = { type: getters.visitor_type }
		await state.infinite.start()
	},
	async visitor_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
	},
	async visitor_getOne({ commit, dispatch }, payload){
		commit('visitor_loadingOneSet', { add: true })
		let res = await api.visitors.getOne(payload)
			commit('visitor_loadingOneSet', { add: false })
		if (!res.data || res.data.error) return

		commit('visitor_currentSet', res.data)
	},

	async visitor_create({ commit, dispatch, state, getters }, payload) {
		commit('visitor_loadingSet', true)
		let res = await api.visitors.create(payload)
		commit('visitor_loadingSet', false)
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		dispatch('notify', 'Посетитель успешно добавлен.')
	},
})

const mutations = merge(infinite.getMutations(true), {
	visitor_destroy: state => state.cached.list = [],
	visitor_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	visitor_filtersSet: (state, payload) => state.filters = payload,
	visitor_sortSet: (state, payload) => state.sort = payload,
	visitor_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	visitor_currentSet: (state, payload) => state.cached.current = payload,
})

const getters = merge(infinite.getGetters(true), {
	visitor_complete: state => state.complete,
	visitor_filters: state => state.filters,
	visitor_current: state => state.cached.current,
	visitor_cached: state => state.cached.list,
	visitor_loading: state => state.loading.list,
})

export default {
	state,
	actions,
	mutations,
	getters
}
