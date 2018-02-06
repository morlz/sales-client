import core from '@/api/core'
import { LocalStorage } from 'quasar'

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
	},
	getToken () {
		return LocalStorage.get.item('token')
	},
	setToken (n) {
		LocalStorage.set('token', n)
	},
	unsetToken () {
		LocalStorage.remove('token')
	}
}
