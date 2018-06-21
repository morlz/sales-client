import core from '@/api/core'
import { Visitor } from '@/lib'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "visitors",
			params
		})
	},
	async getOne (id) {
		let res = await core.invoke({
			method: "get",
			type: "visitor",
			data: {
				id
			}
		})

		if (res.data && !res.data.error)
			res.data = res.data instanceof Visitor ? res.data : new Visitor(res.data)

		return res
	},
	async create (data) {
		return core.invoke({
			method: 'post',
			type: 'visitors',
			data
		})
	},
	async remove (id) {
		return core.invoke({
			method: 'delete',
			type: 'visitor',
			data: {
				id
			}
		})
	},
}
