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
	async getModels (ID_SALONA) {
		return await core.invoke({
			method: "get",
			type: "furnituremodels",
			params: {
				ID_SALONA
			}
		})
	}
}
