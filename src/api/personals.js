import core from '@/api/core'
import { Manager } from '@/lib'

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
		let res = await core.get('manager', { id })
		if (!res) return

		return new Manager(res)
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
