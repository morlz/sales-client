import api from '@/api'

const state = {
	cached: [],
	loading: true,

	salonList: [],
	salonListLoading: true,

}

const actions = {
	getOneSalon({ commit, dispatch }, payload){
		commit('loadingSalonsSet', true)
		api.salons
			.getOne(payload)
			.then(({ data }) => {
				commit('updateCachedSalons', [data])
				commit('loadingSalonsSet', false)
			})
	},
	getSalonsByIds({ commit, dispatch }, payload){
		commit('loadingSalonsSet', true)
		api.salons
			.getByIds(payload)
			.then(({ data }) => {
				commit('updateCachedSalons', data)
				commit('loadingSalonsSet', false)
			})
	},
	getSalonsList ({ commit, dispatch }) {
		commit('updateSalonsListLoading', true)
		api.salons
			.getList()
			.then(({ data }) => {
				commit('updateSalonsList', data)
				commit('updateSalonsListLoading', false)
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
	loadingSalonsSet: (store, payload) => store.loading = payload,
	updateSalonsList: (store, payload) => store.salonList = payload,
	updateSalonsListLoading: (store, payload) => store.salonListLoading = payload
}

const getters = {
	cachedSalons: ({ cached }) => cached,
	loadingSalons: ({ loading }) => loading,
	salonsList: ({ salonList }) => salonList,
	salonsListLoading: ({ salonListLoading }) => salonListLoading
}

export default {
	state,
	actions,
	mutations,
	getters
}
