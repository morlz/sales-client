import core from '@/api/core'

export default {
	async getOne(id) {
		return await core.invoke({
			method: "get",
			type: "manager",
			data: {
				id
			}
		})
	},
	async getByIds (ids) {
		let params = core.prepareArrays({ ids })

		return await core.invoke({
			method: "get",
			type: "managers",
			params
		})
	},
	async getManagerProfile (id) {
		return await core.invoke({
			method: "get",
			type: "manager",
			data: {
				id
			}
		})
	}
}
