import core from '@/api/core'
import { Salon } from '@/lib'

export default {
	async getOne(id) {
		return await core.invoke({
			method: "get",
			type: "salon",
			data: {
				id
			}
		})
	},
	async getByIds (ids) {
		let params = core.prepareArrays({ ids })

		return await core.invoke({
			method: "get",
			type: "salons",
			params
		})
	},
	async getList () {
		let params = core.prepareArrays({
			type: "list"
		})

		let res = await core.invoke({
			method: "get",
			type: "salons",
			params
		})

		if (Array.isArray(res.data))
			res.data = res.data.map(el => new Salon(el))

		return res
	},
	async getPlaces (id) {
		return await core.invoke({
			method: "get",
			type: 'salon/places',
			data: {
				id
			}
		})
	}
}
