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
		return await core.fakeInvoke({
			method: "get",
			type: "clients",
			data: {
				phone
			}
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
