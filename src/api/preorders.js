import core from '@/api/core'

export default {
	async getAll () {
		return await core.invoke({
			method: "GET",
			type: "preorders"
		})
	},
	async getOne(id) {
		return await core.invoke({
			method: "get",
			type: "preorder",
			data: {
				id
			}
		})
	},
	async getStatuses () {
		return await core.invoke({
			method: "GET",
			type: "preorderstats"
		})
	},
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "preorders",
			params
		})
	},
	async create (params) {
		params = core.prepareArrays(params)
		return await core.invoke({
			method: 'post',
			type: 'preorders',
			params
		})
	}
}
