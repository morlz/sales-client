import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "managers",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "manager",
			data: {
				id
			}
		})
	},
	async getOneRolesSetup (id) {
		return await core.invoke({
			method: "get",
			type: "rolesetup",
			data: {
				id
			}
		})
	},
	async saveRoleSetupState (data) {
		data = core.prepareArrays(data)

		return await core.invoke({
			method: "put",
			type: "rolesetup",
			data
		})
	},
}
