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
	async getModels ({ filters, type }) {
		return await core.invoke({
			method: "get",
			type: "furnitures",
			params: {
				limit: 1e3,
				type,
				models: true,
				filters
			}
		})
	},
	async getNewModels () {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-models"
		})
	},
	async getNewTypes (model_id, palermo = null) {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-model-info",
			params: {
				model_id,
				palermo
			}
		})
	},
	async getNewDekor ({ model_id, type_id, palermo }) {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-dekor",
			params: {
				model_id,
				config_id: type_id,
				palermo
			}
		})
	},
	async getNewCat () {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-cat"
		})
	},
	async getNewCloth (params) {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-cloth",
			params
		})
	}
}
