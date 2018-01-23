import core from '@/api/core'

export default {
	async getAll () {
		return await core.invoke({
			method: "get",
			type: "carts"
		})
	},
	async remove (data) {
		return await core.invoke({
			method: "delete",
			type: "cart",
			data
		})
	},
	async add (data) {
		return await core.invoke({
			method: "post",
			type: "carts",
			data
		})
	},
}
