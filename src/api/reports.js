import core from '@/api/core'
import ReportResumeChartYeare from '@/lib/reports/ReportResumeChartYeare'
import groupBy from 'lodash.groupby'


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

		return await core.invoke({
			method: 'get',
			type: 'report/resume',
			params
		})
	},
	async getResumeAllChart () {
		let res = await core.invoke({
			method: 'get',
			type: 'report/resume-all'
		})

		if (!Array.isArray(res.data))
			return res

		let grouped = groupBy(res.data, 'year')

		res.data = {}
		Object.keys(grouped).forEach(key => res.data[key] = new ReportResumeChartYeare(grouped[key]))

		return res
	}
}
