import api from '@/api'
import { SalonGroupSetup } from '@/lib'

const state = {
	cached: {
		groups: [],
		groupsSetup: []
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
	async salonGroups_init({ commit, dispatch }, user_id) {
		return Promise.all([
			dispatch('salonGroups_getGroups'),
			dispatch('salonGroups_getGroupsSetup', user_id),
			dispatch('salon_getList', null, { root: true })
		])
	},
	async salonGroups_getGroups ({ commit, dispatch }) {
		let groups = await api.permissions.getGroups()
		if (!groups) return

		console.log(groups);

		commit('salonGroups_cacheSet', { groups })
	},
	async salonGroups_getGroupsSetup ({ commit, dispatch }, user_id) {
		let groupsSetup = await api.permissions.getGroupsSetup(user_id)
		if (!groupsSetup) return

		console.log(groupsSetup);

		commit('salonGroups_cacheSet', { groupsSetup })
	},
	salonGroups_groupsSetupSet({ commit, dispatch }, { value, group_id, manager_id }) {
		value ?
			commit('salonGroups_check', { group_id, manager_id })
		:	commit('salonGroups_uncheck', group_id)
	},
	async salonGroups_saveState ({ commit, dispatch, state }, id) {
		let res = await api.permissions.setUserGroups({
			id,
			groups: state.cached.groupsSetup.map(el => el.group_id)
		})
		if (!res) return

		dispatch('notify', 'Успешно сохранено!', { root: true })
	},



	async salonGroups_createGroup ({ commit, dispatch, state }) {
		if (!state.add.group)
			return dispatch('alert', 'Имя новой группы не может быть пустым')
		let res = await api.permissions.createGroup(state.add.group)

		if (!res.data || res.data.error) return

		commit('salonGroups_cacheAppend', res.data)
		dispatch('notify', 'Группа создана', { root: true })
	},
	async salonGroups_deleteGroup ({ commit, dispatch }, payload) {
		let res = await api.permissions.deleteGroup(payload)
		if (!res.data || res.data.error) return

		commit('salonGroups_cacheRemoveItem', res.data)
		dispatch('notify', 'Успешно удалено', { root: true })
	},
	async salonGroups_updateGroup ({ commit, dispatch }, payload) {
		let res = await api.permissions.updateGroup(payload)
		if (!res.data || res.data.error) return

		commit('salonGroups_cacheUpdateItem', res.data)
		dispatch('notify', 'Успешно изменено', { root: true })
	},
	salonGroups_checkedGroupChange ({ commit, rootGetters, state }, { checked, item }) {
		commit('salonGroups_removeSalonFromGroups', { salon_id: state.selected.id })
		let salon = rootGetters.salon_list.find(f => f.ID_SALONA == state.selected.id)
		if (checked && salon)
			commit('salonGroups_addSalonToGroup', {
				group_id: item.id,
				salon
			})
	},
	salonGroups_checkedSalonChange ({ commit, state }, { item, checked }) {
		if (checked) {
			commit('salonGroups_addSalonToGroup', {
				group_id: state.selected.id,
				salon: item
			})
		} else {
			return
			commit('salonGroups_removeSalonFromGroup', {
				salon_id: item.ID_SALONA,
				group_id: state.selected.id
			})
		}
	},
}

const mutations = {
	salonGroups_uncheck: (state, payload) => state.cached.groupsSetup = state.cached.groupsSetup.filter(el => el.group_id != payload),
	salonGroups_check: (state, payload) => state.cached.groupsSetup.push(new SalonGroupSetup(payload)),

	salonGroups_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	salonGroups_cacheAppend: (state, payload) => state.cached.groups.push(payload),
	salonGroups_cacheUpdateItem: (state, payload) => state.cached.groups = [...state.cached.groups.filter(el => el.id != payload.id), payload],
	salonGroups_cacheRemoveItem: (state, payload) => state.cached.groups = state.cached.groups.filter(el => el.id != (payload.id || payload)),
	salonGroups_selectItem: (state, payload) => state.selected = payload,
	salonGroups_setAddGroup: (state, payload) => state.add.group = payload,
	salonGroups_removeSalonFromGroups: (state, payload) =>
		state.cached.groups = state.cached.groups.map(
			el => ( { ...el, salons: el.salons ? el.salons.filter(f => f.ID_SALONA != payload.salon_id) : [] } )
		),
	salonGroups_addSalonToGroup: (state, payload) => {
		let group = state.cached.groups.find(f => f.id == payload.group_id)
		if (!group) return
		group.salons ? group.salons.push(payload.salon) : [payload.salon]
	},
	salonGroups_removeSalonFromGroup: (state, payload) => {
		let group = state.cached.groups.find(f => f.id == payload.group_id)
		if (!group) return
		group.salons = group.salons ? group.salons.filter(el => el.ID_SALONA != payload.salon_id) : []
	},
}

const getters = {
	salonGroups_groups: state => state.cached.groups.map(el => {
		el.selected = state.selected.type == 'groups' && state.selected.id == el.id
		el.checked = el.salons ? !!el.salons.find(f => f.ID_SALONA == state.selected.id) : !1
		return { ...el }
	}),
	salonGroups_salons: (state, getters, rootState, rootGetters) => rootGetters.salon_list.map(el => {
		el.selected = state.selected.type == 'salons' && state.selected.id == el.ID_SALONA
		let group = state.cached.groups.find(f => f.id == state.selected.id)
		el.checked = group ? !!group.salons.find(f => f.ID_SALONA == el.ID_SALONA) : false
		return { ...el }
	}),
	salonGroups_groupCheckboxHide: state => state.selected.type != 'salons',
	salonGroups_salonCheckboxHide: state => state.selected.type != 'groups',


	salonGroups_list: state => state.cached.groups,
	salonGroups_checked: state => state.cached.groupsSetup.map(el => el.group_id)
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
