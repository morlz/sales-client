import api from '@/api'

const state = {
	managers: [],
	rolesSetup: [],
	roles: [],
	controllersSetup: [],
	controllers: [],
	rangesSetup: [],
	ranges: [],
	selected: {
		type: "",
		id: -1
	},
	add: {
		role: "",
		controller: "",
		range: ""
	}
}

const actions = {
	permissions_init ({ commit, dispatch }) {
		dispatch('permissions_getManagers')
		dispatch('permissions_getRoles')
		dispatch('permissions_getControllers')
		//dispatch('permissions_getRanges')
		dispatch('permissions_getRolesSetup')
		dispatch('permissions_getControllersSetup')
		//dispatch('permissions_getRangesSetup')
	},
	permissions_getManagers ({ commit, dispatch }) {
		api.permissions.getManagers()
			.then(({ data }) => {
				commit('permissions_setCachedManagers', data)
			})
	},
	permissions_getRoles ({ commit, dispatch }) {
		api.permissions.getRoles()
			.then(({ data }) => {
				commit('permissions_setCachedRoles', data)
			})
	},
	permissions_getControllers ({ commit, dispatch }) {
		api.permissions.getControllers()
			.then(({ data }) => {
				commit('permissions_setCachedControllers', data)
			})
	},
	permissions_getRanges ({ commit, dispatch }) {
		api.permissions.getRanges()
			.then(({ data }) => {
				commit('permissions_setCachedRanges', data)
			})
	},
	permissions_getRolesSetup ({ commit, dispatch }) {
		api.permissions.getRolesSetup()
			.then(({ data }) => {
				commit('permissions_setCachedRolesSetup', data)
			})
	},
	permissions_getControllersSetup ({ commit, dispatch }) {
		api.permissions.getControllersSetup()
			.then(({ data }) => {
				commit('permissions_setCachedControllersSetup', data)
			})
	},
	permissions_getRangesSetup ({ commit, dispatch }) {
		api.permissions.getRangesSetup()
			.then(({ data }) => {
				commit('permissions_setCachedRangesSetup', data)
			})
	},
}

const mutations = {
	permissions_selectItem: (state, payload) => state.selected = payload,
	permissions_setCachedManagers: (state, payload) => state.managers = payload,
	permissions_setCachedRoles: (state, payload) => state.roles = payload,
	permissions_setCachedControllers: (state, payload) => state.controllers = payload,
	permissions_setCachedRanges: (state, payload) => state.ranges = payload,
	permissions_setCachedRolesSetup: (state, payload) => state.rolesSetup = payload,
	permissions_setCachedControllersSetup: (state, payload) => state.controllersSetup = payload,
	permissions_setCachedRangesSetup: (state, payload) => state.rangesSetup = payload,
	permissions_setAddRole: (state, payload) => state.add.role = payload,
	permissions_setAddController: (state, payload) => state.add.controller = payload,
	permissions_setAddRange: (state, payload) => state.add.range = payload,
}

const getters = {
	permissions_selectedType: state => state.selected.type,
	permissions_managers: state => state.managers.map(el => {
		el.selectable = false
		el.selected = false
		if (state.selected.type == "roles") {
			el.selectable = true
			el.checked = !!state.rolesSetup.find(itm => itm.manager_id == state.selected.id && itm.role_id == el.ID_M)
		}

		if (state.selected.type == "managers" && state.selected.id == el.ID_M)
			el.selected = true

		return el
	}),
	permissions_roles: state => state.roles.map(el => {
		el.selectable = false
		el.selected = false
		if (state.selected.type == "managers") {
			el.selectable = true
			el.checked = !!state.rolesSetup.find(itm => itm.manager_id == state.selected.id && itm.role_id == el.id)
		}

		if (state.selected.type == "controllers") {
			el.selectable = true
			let relation = state.controllersSetup.find(itm => itm.action_id == state.selected.id && itm.role_id == el.id)
			el.level = relation ? relation.access_level : 0
		}

		if (state.selected.type == "roles" && state.selected.id == el.id)
			el.selected = true

		return el
	}),
	permissions_controllers: state => state.controllers.map(el => {
		el.selectable = false
		el.selected = false
		if (state.selected.type == "roles") {
			el.selectable = true
			let relation = state.controllersSetup.find(itm => itm.role_id == state.selected.id && itm.action_id == el.id)
			el.level = relation ? relation.access_level : 0
		}

		if (state.selected.type == "controllers" && state.selected.id == el.id)
			el.selected = true

		return el
	}),
	permissions_ranges: state => state.ranges,
	permissions_rolesSetup: state => state.rangesSetup,
	permissions_rangesSetup: state => state.rangesSetup,
	permissions_managersAllCheckBoxHide: state => state.selected.type != "roles",
	permissions_rolesAllCheckBoxHide: state => state.selected.type != "managers",
	permissions_rolesShowRangeSelect: state => state.selected.type == "controllers",

}

export default {
	state,
	actions,
	mutations,
	getters
}
