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

let sortSalons = (a, b) => {
	if (a.id == 999 || a.id == 10 || a.id == 1040) return -1
	if (b.id == 999 || b.id == 10 || b.id == 1040) return 1

	if (a.NAME.toLowerCase() < b.NAME.toLowerCase()) return -1
	if (a.NAME.toLowerCase() > b.NAME.toLowerCase()) return 1
}

const getters = {
	cachedSalons: ({ cached }) => cached,
	loadingSalons: ({ loading }) => loading,
	salonsList: ({ salonList }) => salonList.sort(sortSalons),
	salonsListDiscount: ({ salonList }) => salonList.sort(sortSalons).filter(el => el.id != 10),
	salonsListFurniture: ({ salonList }) => salonList.sort(sortSalons).filter(el => el.id != 1040 && el.id != 10),
	salonsListLoading: ({ salonListLoading }) => salonListLoading
}

export default {
	state,
	actions,
	mutations,
	getters
}
