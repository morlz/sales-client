import api from '@/api'

const state = {
	cached: [],
	loading: true,
	salonList: [],
	salonListLoading: true,
}

const actions = {
	async getOneSalon({ commit, dispatch }, payload){
		commit('loadingSalonsSet', true)
		let res = await api.salons.getOne(payload)
		commit('loadingSalonsSet', false)

		if (!res.data || res.data.error) return
		commit('updateCachedSalons', [res.data])
	},
	async getSalonsByIds({ commit, dispatch }, payload){
		commit('loadingSalonsSet', true)
		let res = await api.salons.getByIds(payload)
		commit('loadingSalonsSet', false)

		if (!res.data || res.data.error) return
		commit('updateCachedSalons', res.data)
	},
	async getSalonsList ({ commit, dispatch, state }) {
		if (state.salonList.length) return
		commit('updateSalonsListLoading', true)
		let res = await api.salons.getList()
		commit('updateSalonsListLoading', false)

		if (!res.data || res.data.error) return
		commit('updateSalonsList', res.data)
	}
}

const mutations = {
	updateCachedSalons(store, payload){
		payload.map(el => {
			let id = el.ID_SALONA || el
			store.cached = store.cached.filter(el2 => el2.ID_SALONA != id)
			store.cached.push(el)
		})
	},
	loadingSalonsSet: (store, payload) => store.loading = payload,
	updateSalonsList: (store, payload) => store.salonList = payload,
	updateSalonsListLoading: (store, payload) => store.salonListLoading = payload
}

let sortSalons = (a, b) => {
	if (a.id == 999 || a.id == "" || a.id == 10 || a.id == 1040) return -1
	if (b.id == 999 || b.id == "" || b.id == 10 || b.id == 1040) return 1

	if (a.NAME.toLowerCase() < b.NAME.toLowerCase()) return -1
	if (a.NAME.toLowerCase() > b.NAME.toLowerCase()) return 1
}

const getters = {
	cachedSalons: ({ cached }) => cached,
	loadingSalons: ({ loading }) => loading,
	salonsList: ({ salonList }) => salonList.sort(sortSalons),
	salonsListDiscount: ({ salonList }) => salonList.sort(sortSalons).filter(el => el.id != 10),
	salonsListFurniture: ({ salonList }) => salonList.sort(sortSalons).filter(el => el.id != 1040 && el.id != 10),
	salonsListLoading: ({ salonListLoading }) => salonListLoading,
	salon_list_discount: state => state.salonList
		.filter(el => el.ID_SALONA != 10)
		.map(el => {
			if (el.ID_SALONA == '999')
				el.ID_SALONA = undefined
			return el
		})
		.sort(api.core.sortFnFactory(salon => salon.ID_SALONA == undefined ? 'ААААА' : salon.NAME, true)),
	salon_list_furniture: state => state.salonList
		.filter(el => el.ID_SALONA != 1040 && el.ID_SALONA != 10)
		.map(el => {
			if (el.ID_SALONA == '999')
				el.ID_SALONA = undefined
			return el
		})
		.sort(api.core.sortFnFactory(salon => salon.ID_SALONA == undefined ? 'AAAAA' : salon.NAME, true))
}

export default {
	state,
	actions,
	mutations,
	getters
}
