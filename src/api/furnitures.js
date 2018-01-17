import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "furnitures",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "furniture",
			data: {
				id
			}
		})
	},
	async getModels ({ salon, type }) {
		return await core.invoke({
			method: "get",
			type: "furnitures",
			params: {
				limit: 1e3,
				type,
				models: true,
				salon
			}
		})
	}
}
