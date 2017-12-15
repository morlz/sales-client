import api from '@/api'

const state = {
	cached: [],
	loading: true
}

const actions = {
	getOneSalon({ commit, dispatch }, payload){
		commit('loadingSalonsSet', true)
		api.preorders.salons
			.getOne(payload)
			.then(({ data }) => {
				commit('updateCachedSalons', [data])
				commit('loadingSalonsSet', false)
			})
	},
	getSalonsByIds({ commit, dispatch }, payload){
		commit('loadingSalonsSet', true)
		api.preorders.salons
			.getByIds(payload)
			.then(({ data }) => {
				commit('updateCachedSalons', data)
				commit('loadingSalonsSet', false)
			})
	}
}

const mutations = {
	updateCachedSalons(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	loadingSalonsSet(store, payload) {
		store.loading = payload
	}
}

const getters = {
	cachedSalons: ({ cached }) => cached,
	loadingSalons: ({ loading }) => loading,
}

export default {
	state,
	actions,
	mutations,
	getters
}
