import core from '@/api/core'

export default {
	async getList () {
		let params = core.prepareArrays({
			type: "list"
		})

		return await core.invoke({
			method: "get",
			type: "salons",
			params
		})
	}
}
