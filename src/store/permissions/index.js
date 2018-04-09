import api from '@/api'
import salonGroups from './salonGroups'

const compare = (a, b) => {
	if (a.id < b.id)
		return -1

	if (a.id > b.id)
		return 1

	return 0
}

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
	},
	loading: {
		roles: true,
		controllers: true,
		ranges: true
	}
}

const actions = {
	permissions_updateRole({ commit, dispatch }, payload) {
		api.permissions
			.updateRole(payload)
			.then(res => {
				if (!res.data.error) {
					commit("permissions_updateRole", res.data)
					dispatch("notify", { title: "Успешно", message: "Роль обновлена" })
				}
			})
	},
	permissions_updateController({ commit, dispatch }, payload) {
		api.permissions
			.updateController(payload)
			.then(res => {
				if (!res.data.error) {
					commit("permissions_updateController", res.data)
					dispatch("notify", { title: "Успешно", message: "Контроллер обновлён" })
				}
			})
	},
	permissions_deleteRole({ commit, dispatch }, payload) {
		api.permissions
			.deleteRole(payload)
			.then(res => {
				if (!res.data.error) {
					commit("permissions_removeCachedRole", res.data.id)
					dispatch("notify", { title: "Успешно", message: "Роль удалена" })
				}
			})
	},
	permissions_deleteController({ commit, dispatch }, payload) {
		api.permissions
			.deleteController(payload)
			.then(res => {
				if (!res.data.error) {
					commit("permissions_removeCachedController", res.data.id)
					dispatch("notify", { title: "Успешно", message: "Контроллер удалён" })
				}
			})
	},
	permissions_saveState ({ commit, dispatch, state }) {
		commit("permissions_filterRemovedData")
		api.permissions.saveState({
			controllers: state.controllersSetup,
			ranges: state.rangesSetup
		})
		.then(res => {
			if (!res.data.error) {
				dispatch("notify", { title: "Успешно", message: "Текущее состояние сохранено" })
			}
		})
	},
	async permissions_createRole({ commit, dispatch, state }) {
		if (!state.add.role)
			return dispatch ('notify', 'Ошибка добавления роли, имя новой роли не должно быть пустым')

		let res = await api.permissions.createRole(state.add.role)
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		commit("permissions_appendCachedRoles", res.data)
		dispatch("notify", "Новая роль успешно создана")
	},
	permissions_createController({ commit, dispatch, state }) {
		if (!state.add.controller)
			dispatch ('notify', {
				title: "Ошибка добавления контролера",
				message: "Имя нового контроленра не должно быть пустым"
			})

		if (state.add.controller)
			api.permissions
				.createController(state.add.controller)
				.then(({ data }) => {
					if (!data.error) {
						commit("permissions_appendCachedController", data)
						dispatch("notify", { title: "Успешно", message: "Новый контроллер создан" })
					}
				})
	},
	permissions_roleLevelChange({ commit, dispatch }, { access_level, item }) {
		commit("permissions_updateCachedControllerSetup", { role_id: item.id, action_id: state.selected.id, access_level })
	},
	permissions_controllerLevelChange({ commit, dispatch }, { access_level, item }) {
		commit("permissions_updateCachedControllerSetup", { role_id: state.selected.id, action_id: item.id, access_level })
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
		commit("permissions_setLoadingRoles", true)
		api.permissions.getRoles()
			.then(({ data }) => {
				commit('permissions_setCachedRoles', data)
				commit("permissions_setLoadingRoles", false)
			})
	},
	permissions_getControllers ({ commit, dispatch }) {
		commit("permissions_setLoadingControllers", true)
		api.permissions.getControllers()
			.then(({ data }) => {
				commit('permissions_setCachedControllers', data)
				commit("permissions_setLoadingControllers", false)
			})
	},
	permissions_getRanges ({ commit, dispatch }) {
		commit("permissions_setLoadingRanges", true)
		api.permissions.getRanges()
			.then(({ data }) => {
				commit('permissions_setCachedRanges', data)
				commit("permissions_setLoadingRanges", false)
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
	permissions_appendCachedRoles: (state, payload) => state.roles = [...state.roles, payload],
	permissions_removeCachedRole: (state, payload) => {
		state.roles = state.roles.filter(el => el.id != payload)
		state.controllersSetup = state.controllersSetup.filter(el => el.role_id != payload)
		state.rangesSetup = state.rangesSetup.filter(el => el.role_id != payload)
	},
	permissions_removeCachedController: (state, payload) => {
		state.controllers = state.controllers.filter(el => el.id != payload)
		state.controllersSetup = state.controllersSetup.filter(el => el.action_id != payload)
	},
	permissions_setCachedControllers: (state, payload) => state.controllers = payload,
	permissions_appendCachedController: (state, payload) => state.controllers = [...state.controllers, payload],
	permissions_setCachedRanges: (state, payload) => state.ranges = payload,
	permissions_setCachedControllersSetup: (state, payload) => state.controllersSetup = payload,
	permissions_updateCachedControllerSetup: (state, { role_id, action_id, access_level }) => {
		let data = state.controllersSetup.find(el => el.role_id == role_id && el.action_id == action_id)
		if (data) {
			data.access_level = access_level
		} else {
			state.controllersSetup.push({ role_id, action_id, access_level })
		}
	},
	permissions_setCachedRangesSetup: (state, payload) => state.rangesSetup = payload,
	permissions_updateRole: (state, payload) => state.roles = [...state.roles.filter(el => el.id != payload.id), payload],
	permissions_updateController: (state, payload) => state.controllers = [...state.controllers.filter(el => el.id != payload.id), payload],
	permissions_setAddRole: (state, payload) => state.add.role = payload,
	permissions_setAddController: (state, payload) => state.add.controller = payload,
	permissions_setAddRange: (state, payload) => state.add.range = payload,
	permissions_setLoadingRoles: (state, payload) => state.loading.roles = payload,
	permissions_setLoadingControllers: (state, payload) => state.loading.controllers = payload,
	permissions_setLoadingRanges: (state, payload) => state.loading.range = payload,
	permissions_filterRemovedData: state => {
		state.controllersSetup = state.controllersSetup
			.filter(el => state.controllers.find(el2 => el.action_id == el2.id) && state.roles.find(el2 => el.role_id == el2.id))

		state.rangesSetup = state.rangesSetup
			.filter(el => state.ranges.find(el2 => el.range_id == el2.id) && state.roles.find(el2 => el.role_id == el2.id))
	}
}

const getters = {
	permissions_selectedType: state => state.selected.type,
	permissions_managers: state => state.managers,
	personal_roles: state => state.roles,
	permissions_roles: state => state.roles.map(el => {
		el.selected = state.selected.type == "roles" && el.id == state.selected.id
		el.levelVisible = state.selected.type == "controllers"

		let relation = state.controllersSetup.find(itm => itm.action_id == state.selected.id && itm.role_id == el.id)
		el.access_level = relation ? relation.access_level : 0

		return { ...el }
	}).sort(compare),
	permissions_controllers: state => state.controllers.map(el => {
		el.selected = state.selected.type == "controllers" && el.id == state.selected.id
		el.levelVisible = state.selected.type == "roles"

		let relation = state.controllersSetup.find(itm => itm.role_id == state.selected.id && itm.action_id == el.id)
		el.access_level = relation ? relation.access_level : 0

		return { ...el }
	}).sort(compare),
	permissions_ranges: state => state.ranges,
	permissions_rolesSetup: state => state.rangesSetup,
	permissions_rangesSetup: state => state.rangesSetup,
	permissions_rolesSliderHide: state => state.selected.type != "controllers",
	permissions_controllersSliderHide: state => state.selected.type != "roles",
	permissions_addRoleFieldShow: state => !!state.add.role.length,
	permissions_addControllerFieldShow: state => !!state.add.controller.length,
	permissions_loading_roles: state => state.loading.roles,
	permissions_loading_controllers: state => state.loading.controllers,
	permissions_loading_ranges: state => state.loading.ranges,
}

const modules = {
	salonGroups
}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
