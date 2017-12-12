import core from '@/api/core'

export default {
	async getAll (ids) {
		let params = core.prepareArrays({ ids })

		return await core.invoke({
			method: "get",
			type: "clients",
			params
		})
	},
	async getOne(id) {
		return await core.invoke({
			method: "get",
			type: "client",
			data: {
				id
			}
		})
	},
	async searchByPhone (phone) {
		let params = core.prepareArrays({
			filters: {
				phone
			}
		})

		return await core.invoke({
			method: "get",
			type: "clients",
			params
		})
	},
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "clients",
			params
		})
	}
}
