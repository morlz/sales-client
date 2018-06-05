import api from '@/api'
import { SalonGroupSetup } from '@/lib'

const state = {
	cached: {
		groups: [],
		groupsSetup: []
	}
}

const actions = {
	async managerGroups_init({ commit, dispatch }, user_id) {
		return Promise.all([
			dispatch('managerGroups_getGroups'),
			dispatch('managerGroups_getGroupsSetup', user_id),
			dispatch('salon_getList', null, { root: true })
		])
	},
	async managerGroups_getGroups ({ commit, dispatch }) {
		let groups = await api.permissions.getGroups()
		if (!groups) return

		commit('managerGroups_cacheSet', { groups })
	},
	async managerGroups_getGroupsSetup ({ commit, dispatch }, user_id) {
		let groupsSetup = await api.permissions.getGroupsSetup(user_id)
		if (!groupsSetup) return

		commit('managerGroups_cacheSet', { groupsSetup })
	},
	managerGroups_groupsSetupSet({ commit, dispatch }, { value, group_id, manager_id }) {
		value ?
			commit('managerGroups_check', { group_id, manager_id })
		:	commit('managerGroups_uncheck', group_id)
	},
	async managerGroups_saveState ({ commit, dispatch, state }, id) {
		let res = await api.permissions.setUserGroups({
			id,
			groups: state.cached.groupsSetup.map(el => el.group_id)
		})
		if (!res) return

		dispatch('notify', 'Успешно сохранено!', { root: true })
	},
}

const mutations = {
	managerGroups_uncheck: (state, payload) => state.cached.groupsSetup = state.cached.groupsSetup.filter(el => el.group_id != payload),
	managerGroups_check: (state, payload) => state.cached.groupsSetup.push(new SalonGroupSetup(payload)),
	managerGroups_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
}

const getters = {
	managerGroups_list: state => state.cached.groups,
	managerGroups_checked: state => state.cached.groupsSetup.map(el => el.group_id)
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
