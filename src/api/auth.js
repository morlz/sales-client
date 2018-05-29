import core from '@/api/core'
import { LocalStorage } from 'quasar'
import { Salon } from '@/lib'

export default {
	async signIn (id) {
		return await core.invoke({
			method: "get",
			type: "auth/signin",
			data: {
				id
			}
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
	async setSalon (id) {
		let res = await core.invoke({
			method: "post",
			type: "auth/set-salon",
			data: {
				id
			}
		})

		if (res.data && res.data.ID_SALONA !== undefined)
			res.data = new Salon(res.data)

		return res
	},
	getToken () {
		return LocalStorage.get.item('token')
	},
	setToken (n) {
		LocalStorage.set('token', n)
	},
	unsetToken () {
		LocalStorage.remove('token')
	},
}
