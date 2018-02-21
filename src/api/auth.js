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
	async getPermissions (data) {
		return await core.invoke({
			method: "post",
			type: "auth/userpermissions",
			data
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
