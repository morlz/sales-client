import api from '@/api'
import { SalonGroupSetup } from '@/lib'

const state = {
	cached: {
		salons: []
	},
}

const actions = {
	async managerSalons_init({ commit, dispatch, rootGetters }) {
		return Promise.all([
			dispatch('managerSalons_getSetup'),
			dispatch('salon_getList', null, { root: true })
		])
	},
	async managerSalons_getSetup ({ commit, dispatch, rootGetters }) {
		if (!rootGetters.personal_current.id) return
		let salons = await api.permissions.getManagerSalonsSetup(rootGetters.personal_current.id)
		if (!salons) return

		commit('managerSalons_cachedSalonsSet', salons)
	},
	async managerSalons_saveState ({ commit, dispatch, state, rootGetters }) {
		let res = await api.permissions.setManagerSalonsSetup({
			id: rootGetters.personal_current.id,
			salons: state.cached.salons
		})
		if (!res) return

		dispatch('notify', 'Успешно сохранено!', { root: true })
		commit('managerSalons_cachedSalonsSet', res)
	},
}

const mutations = {
	managerSalons_uncheck: (state, payload) => state.cached.salons = state.cached.salons.filter(el => el != payload),
	managerSalons_check: (state, payload) => state.cached.salons.push(payload),
	managerSalons_cachedSalonsSet: (state, payload) => state.cached.salons = payload.map(el => +el.salon_id)
}

const getters = {

}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
