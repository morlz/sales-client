import core from '@/api/core'
import { Shipment } from '@/lib'

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
		let res = await core.invoke({
			method: "get",
			type: "shipment",
			data: {
				id
			}
		})

		if (res.data && !res.data.error)
			res.data = res.data instanceof Shipment ? res.data : new Shipment(res.data)

		return res
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
