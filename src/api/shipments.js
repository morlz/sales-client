import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "shipments",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "shipment",
			data: {
				id
			}
		})
	},
	async create (data) {
		return core.invoke({
			method: 'post',
			type: 'shipments',
			data
		})
	},
	async remove (id) {
		return core.invoke({
			method: 'delete',
			type: 'shipment',
			data: {
				id
			}
		})
	},
	async addRows ({ shipment_id, rows }) {
		return await core.invoke({
			method: 'put',
			type: 'shipment/add-rows',
			data: {
				id: shipment_id,
				rows
			}
		})
	},
	async removeRow (data) {
		return await core.invoke({
			method: 'delete',
			type: 'shipment/remove-row',
			data
		})
	},
	async update (data) {
		return await core.invoke({
			method: 'put',
			type: 'shipment',
			data
		})
	}
}
