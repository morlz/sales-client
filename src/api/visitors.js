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
		let res = await core.post('visitors', data)
		if (res.id)
			return new Visitor(res)

		return res
	},
	async remove (id) {
		let res = await core.delete('visitor', { id })
		if (res.id)
			return new Visitor(res)

		return res
	},
}
