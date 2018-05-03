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
				'contactfaces.phone': phone
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
	},
	async addContact (data) {
		return await core.invoke({
			method: "post",
			type: "contactfaces",
			data
		})
	},
	async editContact (data) {
		return await core.invoke({
			method: "put",
			type: "contactface",
			data
		})
	},
	async update (data) {
		return await core.invoke({
			method: 'put',
			type: 'client',
			data
		})
	}
}
