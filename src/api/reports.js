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
	async getSalesTwo (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "report/sales-two",
			params
		})
	},
	async getResume (params) {
		params = core.prepareArrays(params)

		return core.invoke({
			method: 'get',
			type: 'report/resume',
			params
		})
	}
}
