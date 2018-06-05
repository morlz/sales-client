import api from '@/api'
import { SalonGroupSetup } from '@/lib'
import invertby from 'lodash.invertby'
import Vue from 'vue'

const state = {
	cached: {
		groups: [],
		changed: {}
	},
	selected: {
		type: "",
		id: -1
	},
	add: {
		group: ""
	}
}

const actions = {
	async salonGroups_init({ commit, dispatch }) {
		return Promise.all([
			dispatch('salonGroups_getGroups'),
			dispatch('salon_getList', null, { root: true })
		])
	},
	async salonGroups_getGroups ({ commit, dispatch }) {
		let groups = await api.permissions.getGroups()
		if (!groups) return

		commit('salonGroups_cacheSet', { groups })
	},
	salonGroups_groupsSetupSet({ commit, dispatch }, { value, group_id, manager_id }) {
		value ?
			commit('salonGroups_check', { group_id, manager_id })
		:	commit('salonGroups_uncheck', group_id)
	},
	async salonGroups_saveState ({ commit, dispatch, state }, id) {
		let res = await api.permissions.saveGroupsState({ changed: state.cached.changed })
		if (!res) return

		dispatch('notify', 'Успешно сохранено!', { root: true })
	},

	salonGroups_salonCheck ({ commit, rootGetters, state }, { checked, salon }) {
		if (checked) {
			commit('salonGroups_addSalonToGroup', { salon_id: salon.id, group_id: state.selected.id })
		} else {
			commit('salonGroups_removeSalonFromGroup', { salon_id: salon.id })
		}
	},
	salonGroups_groupCheck ({ commit, state }, { group, checked }) {
		if (checked) {
			commit ('salonGroups_addSalonToGroup', { salon_id: state.selected.id, group_id: group.id })
		} else {
			commit('salonGroups_removeSalonFromGroup', { salon_id: state.selected.id })
		}
	},

	async salonGroups_createGroup ({ commit, dispatch, state }) {
		if (!state.add.group)
			return dispatch('alert', 'Имя новой группы не может быть пустым')

		let res = await api.permissions.createGroup(state.add.group)

		if (!res) return

		commit('salonGroups_cacheAppend', res)
		dispatch('notify', 'Группа создана', { root: true })
	},
	async salonGroups_deleteGroup ({ commit, dispatch }, payload) {
		let res = await api.permissions.deleteGroup(payload)
		if (!res) return

		commit('salonGroups_cacheRemoveItem', res)
		dispatch('notify', 'Успешно удалено', { root: true })
	},
	async salonGroups_updateGroup ({ commit, dispatch }, payload) {
		console.log(payload);
		let res = await api.permissions.updateGroup(payload.pure())
		if (!res || res.error) return

		commit('salonGroups_cacheUpdateItem', res)
		dispatch('notify', 'Успешно изменено', { root: true })
	},
}

const mutations = {
	salonGroups_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	salonGroups_addSalonToGroup: (state, payload) => Vue.set(state.cached.changed, +payload.salon_id, +payload.group_id),
	salonGroups_removeSalonFromGroup: (state, payload) => Vue.set(state.cached.changed, +payload.salon_id, null),
	salonGroups_cacheAppend: (state, payload) => state.cached.groups.push(payload),
	salonGroups_cacheUpdateItem: (state, payload) =>  state.cached.groups.find(el => el.id == payload.id).update(payload),
	salonGroups_cacheRemoveItem: (state, payload) => state.cached.groups = state.cached.groups.filter(el => el.id != (payload.id || payload)),
	salonGroups_selectItem: (state, payload) => state.selected = payload,
	salonGroups_setAddGroup: (state, payload) => state.add.group = payload,
}

const getters = {
	salonGroups_groups: state => state.cached.groups,
	salonGroups_salons: (state, getters, rootState, rootGetters) => rootGetters.salon_list,
	salonGroups_groupCheckboxHide: state => state.selected.type != 'salons',
	salonGroups_salonCheckboxHide: state => state.selected.type != 'groups',
	salonGroups_checked: (state, getters) => {
		let changed = invertby(state.cached.changed),
			changedIds = Object.keys(state.cached.changed).map(el => +el)

		return getters.salonGroups_groups.reduce((prev, group) => {
			prev[group.id] = getters.salonGroups_salons
				.filter(salon => salon.group_id == group.id && !changedIds.includes(salon.id))
				.map(salon => salon.id)
				.concat((changed[group.id] || []).map(el => +el))

			return prev
		}, {})
	},
	salonGroups_selected: state => state.selected,
	salonGroups_changed: state => state.cached.changed,
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
