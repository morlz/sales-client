import api from '@/api'

const types = [
	"roles",
	"controllers",
	"ranges"
]

const state = {
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
	permissions_roleLevelChange({ commit, dispatch }, { e, item }) {
		console.log(e, item);
	},
	permissions_controllerLevelChange({ commit, dispatch }, { e, item }) {
		console.log(e, item);
	},
	permissions_init ({ commit, dispatch }) {
		dispatch('permissions_getRoles')
		dispatch('permissions_getControllers')
		//dispatch('permissions_getRanges')
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
	permissions_setCachedRoles: (state, payload) => state.roles = payload,
	permissions_setCachedControllers: (state, payload) => state.controllers = payload,
	permissions_setCachedRanges: (state, payload) => state.ranges = payload,
	permissions_setCachedControllersSetup: (state, payload) => state.controllersSetup = payload,
	permissions_setCachedRangesSetup: (state, payload) => state.rangesSetup = payload,
	permissions_setAddRole: (state, payload) => state.add.role = payload,
	permissions_setAddController: (state, payload) => state.add.controller = payload,
	permissions_setAddRange: (state, payload) => state.add.range = payload,
}

const getters = {
	permissions_selectedType: state => state.selected.type,
	permissions_managers: state => state.managers,
	permissions_roles: state => state.roles.map(el => {
		el.selected = state.selected.type == "roles" && el.id == state.selected.id
		el.levelVisible = state.selected.type == "controllers"
		
		let relation = state.controllersSetup.find(itm => itm.action_id == state.selected.id && itm.role_id == el.id)
		el.level = relation ? relation.access_level : 0

		return el
	}),
	permissions_controllers: state => state.controllers.map(el => {
		el.selected = state.selected.type == "controllers" && el.id == state.selected.id
		el.levelVisible = state.selected.type == "roles"

		let relation = state.controllersSetup.find(itm => itm.role_id == state.selected.id && itm.action_id == el.id)
		el.level = relation ? relation.access_level : 0

		return el
	}),
	permissions_ranges: state => state.ranges,
	permissions_rolesSetup: state => state.rangesSetup,
	permissions_rangesSetup: state => state.rangesSetup,
	permissions_rolesSliderHide: state => state.selected.type != "controllers",
	permissions_controllersSliderHide: state => state.selected.type != "roles",
}

export default {
	state,
	actions,
	mutations,
	getters
}
