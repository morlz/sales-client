import core from '@/api/core'
import { SalonGroup, SalonGroupSetup } from '@/lib'

export default {
	async getManagers (params = {}) {
		params.limit = 1000
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "managers",
			params
		})
	},
	async getRoles (params = {}) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "roles",
			params
		})
	},
	async getControllers (params = {}) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "actions",
			params
		})
	},
	async getRanges (params = {}) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "ranges",
			params
		})
	},
	async getRolesSetup (params = {}) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "rolesetups",
			params
		})
	},
	async getControllersSetup (params = {}) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "actionsetups",
			params
		})
	},
	async getRangesSetup (params = {}) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "rangesetups",
			params
		})
	},
	async createRole (name) {
		return await core.invoke({
			method: "post",
			type: "roles",
			data: {
				name,
				type: 'action'
			}
		})
	},
	async createController (name) {
		return await core.invoke({
			method: "post",
			type: "actions",
			data: {
				name
			}
		})
	},
	async saveState (data) {
		data = core.prepareArrays(data)

		return await core.invoke({
			method: "put",
			type: "savestate",
			data
		})
	},
	async deleteRole (id) {
		return await core.invoke({
			method: "delete",
			type: "role",
			data: {
				id
			}
		})
	},
	async deleteController (id) {
		return await core.invoke({
			method: "delete",
			type: "action",
			data: {
				id
			}
		})
	},
	async updateRole (data) {
		return await core.invoke({
			method: "put",
			type: "role",
			data
		})
	},
	async updateController (data) {
		return await core.invoke({
			method: "put",
			type: "action",
			data
		})
	},
	async getGroups () {
		let res = await core.get('salon-groups')
		if (Array.isArray(res))
			return res.map(el => new SalonGroup(el))

		return res
	},
	async getGroupsSetup (id) {
		let res = await core.get('salon-group', { id })
		if (Array.isArray(res))
			return res.map(el => new SalonGroupSetup(el))

		return res
	},
	async getGroupSetup (id) {
		return await core.invoke({
			method: 'get',
			type: 'rolesetups/manager',
			params: {
				id
			}
		})
	},
	async createGroup (name) {
		return await core.invoke({
			method: "post",
			type: "role/create-group",
			data: {
				name,
				type: 'group'
			}
		})
	},
	async deleteGroup (id) {
		return await core.invoke({
			method: "delete",
			type: "role/delete-group",
			data: {
				id
			}
		})
	},
	async updateGroup (data) {
		return core.invoke({
			method: "put",
			type: "role/update-group",
			data
		})
	},
	async saveGroupsState (groups) {
		return core.invoke({
			method: "put",
			type: "role/save-groups-state",
			data: {
				groups
			}
		})
	},
	async setUserGroups (data) {
		return await core.put('salon-group/set-for-manager', data)
	},
	async getManagerSalonsSetup (id) {
		return await core.get('manager/salons', { id })
	},
	async setManagerSalonsSetup (data) {
		return await core.put('manager/set-salons', data)
	}
}
