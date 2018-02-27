import api from '@/api'

const state = {
	cached: {
		list: []
	},
	loading: {
		list: false,
		one: false
	},
	all: false
}

const actions = {
	async getOneSalon({ commit, dispatch }, payload){
		commit('salon_loadingSet', { type: 'list', data: true })
		let res = await api.salons.getOne(payload)
		commit('salon_loadingSet', { type: 'list', data: false })

		if (!res.data || res.data.error) return
		commit('salon_listUpdate', [res.data])
	},
	async getSalonsByIds({ commit, dispatch }, payload){
		commit('salon_loadingSet', { type: 'list', data: true })
		let res = await api.salons.getByIds(payload)
		commit('salon_loadingSet', { type: 'list', data: false })

		if (!res.data || res.data.error) return
		commit('salon_listUpdate', res.data)
	},
	async salon_getList ({ commit, dispatch, state }) {
		if (state.all) return
		commit('salon_loadingSet', { type: 'list', data: true })
		let res = await api.salons.getList()
		commit('salon_loadingSet', { type: 'list', data: false })

		if (!res.data || res.data.error) return
		commit('salon_listSet', res.data)
	}
}

const mutations = {
	salon_listSet: (state, payload) => (state.cached.list = payload, state.all = true),
	salon_listUpdate: (state, payload) => state.cached.list = [
		...state.cached.list.filter(
			cachedSalon => !payload.reduce(
				(newSalon, prev) => prev || cachedSalon.ID_SALONA == newSalon.ID_SALONA, false
			)
		),
		...payload
	],
	salon_loadingSet: (state, payload) => state.loading[payload.type] = payload.data
}

const getters = {
	salon_list: state => state.cached.list.sort(api.core.sortFnFactory(salon => salon.NAME, true)),
	salon_listWithAll: (state, getters) => [ { NAME: "Все салоны" }, ...getters.salon_list ],
	salon_list_discount: (state, getters) => getters.salon_listWithAll.filter(el => el.ID_SALONA != 10),
	salon_list_furniture: (state, getters) => getters.salon_listWithAll.filter(el => el.ID_SALONA != 1040 && el.ID_SALONA != 10),
	salon_loadingList: state => state.loading.list,
}

export default {
	state,
	actions,
	mutations,
	getters
}
