import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "invoices",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "invoice",
			data: {
				id
			}
		})
	},
	async getAdSources () {
		return await core.invoke({
			method: "get",
			type: "invoices/ad-sources"
		})
	},
	async create (data) {
		return await core.invoke({
			method: "post",
			type: "invoices",
			data
		})
	}
}
