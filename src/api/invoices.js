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
			type: "invoice/ad-sources"
		})
	},
	async create (data) {
		return await core.invoke({
			method: "post",
			type: "invoices",
			data
		})
	},
	async addFromCart (id) {
		return await core.invoke({
			method: 'post',
			type: 'cart/to-invoice',
			data: {
				id
			}
		})
	},
	async removeItem (data) {
		let type = 'invoice/remove-' + data.type
		delete(data.type)
		return await core.invoke({
			method: 'delete',
			type,
			data
		})
	},
	async exportToAx (id) {
		return await core.invoke({
			method: "post",
			type: "invoice/export-to-ax",
			data: {
				id
			}
		})
	},
	async exportTo1c (id) {
		return await core.invoke({
			method: "get",
			type: "save1c",
			data: {
				id
			}
		})
	}
}
