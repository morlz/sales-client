import core from '@/api/core'

export default {
	async getAll () {
		return await core.invoke({
			method: "get",
			type: "tasks"
		})
	},
	async getAllTypes () {
		return await core.invoke({
			method: "get",
			type: "tasktypes"
		})
	}
}
