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
	async getSatuses () {
		return await core.invoke({
			method: "GET",
			type: "preorderstats"
		})
	}
}
