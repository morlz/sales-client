import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "storages",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "storage",
			data: {
				id
			}
		})
	}
}
