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
}
