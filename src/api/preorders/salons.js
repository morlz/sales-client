import core from '@/api/core'

export default {
	async getOne(id) {
		return await core.invoke({
			method: "get",
			type: "salon",
			data: {
				id
			}
		})
	}
}
