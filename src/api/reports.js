import core from '@/api/core'

export default {
	async getSales (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "report/sales",
			params
		})
	},
}
