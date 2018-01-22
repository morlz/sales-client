import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "discounts",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "discount",
			data: {
				id
			}
		})
	},
	async getModels ({ filters }) {
		return await core.invoke({
			method: "get",
			type: "discounts",
			params: {
				limit: 1e3,
				models: true,
				filters
			}
		})
	}
}
