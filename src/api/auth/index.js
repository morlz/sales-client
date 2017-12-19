import core from '@/api/core'
import cookie from '@/api/auth/cookie'

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
	cookie
}
