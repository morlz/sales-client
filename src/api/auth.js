import core from '@/api/core'

export default {
	async signIn (params) {
		return await core.invoke({
			method: "get",
			type: "auth/signin",
			params
		})
	},
	async logOut () {
		return await core.invoke({
			method: "get",
			type: "auth/logout"
		})
	},
	async getUserData () {
		return await core.invoke({
			method: "get",
			type: "auth/userdata"
		})
	},
	async getPermissions () {
		return await core.invoke({
			method: "get",
			type: "auth/userpermissions"
		})
	}
}
