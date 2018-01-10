import core from '@/api/core'

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
				name
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
}
