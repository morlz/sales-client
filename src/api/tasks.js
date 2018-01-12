import core from '@/api/core'

export default {
	async getAll () {
		return await core.invoke({
			method: "get",
			type: "tasks"
		})
	},
	async getOne(id) {
		return await core.invoke({
			method: "get",
			type: "task",
			data: {
				id
			}
		})
	},
	async getAllTypes () {
		return await core.invoke({
			method: "get",
			type: "tasktypes"
		})
	},
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "tasks",
			params
		})
	},
	async update (data) {
		return await core.invoke({
			method: "put",
			type: "task",
			data
		})
	},
	async create (params) {
		params = core.prepareArrays(params)
		
		return await core.invoke({
			method: "get",
			type: "tasks/create",
			params
		})
	},
}
