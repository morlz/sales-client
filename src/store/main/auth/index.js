import api from '@/api'
import settings from '@/store/main/auth/settings'


const state = {
	user: false,
	permissions: [],
	salons: [],
	token: "",
	loading: {
		auth: false,
		permissions: false
	},
	form: {
		login: "",
		password: ""
	}
}

const actions = {
	async auth_init ({ commit, dispatch }) {
		let token = api.auth.getToken()

		commit("updateToken", token ? token : "")
		if (!token) return

		commit("auth_loadingSet", true)
		let res = await api.auth.getUserData()
		commit("auth_loadingSet", false)

		if (res.data && res.data.error) {
			if (res.data.error.status == 403)
				commit ('updateToken')
			return
		}

		if (res && res.data && res.data.token) {
			commit("updateUserAuth", res.data)
			commit("updateToken", res.data.token)
			await dispatch("auth_getPermissions")
		}
	},
	async auth_signIn ({ commit, dispatch, state }) {
		let res = await api.auth.signIn(state.form)
		if (res.data && res.data.error) return
		if (res && res.data && res.data.token) {
			commit("updateUserAuth", res.data)
			commit("updateToken", res.data.token)
			await dispatch("auth_getPermissions")
		}
	},
	signUp () {

	},
	async logOut ({ commit, dispatch }) {
		await api.auth.logOut()
		commit("updateUserAuth", false)
		commit("auth_permissionsSet", [])
		commit("updateToken")
	},
	async auth_getPermissions ({ commit, dispatch }) {
		let info = {
			userAgent: window.navigator.userAgent,
			deviceMemory: window.navigator.deviceMemory,
			hardwareConcurrency: window.navigator.hardwareConcurrency,
			downlink: window.navigator.connection.downlink,
			effectiveType: window.navigator.connection.effectiveType,
			gl: {}
		}

		try {
			let { coords } = await dispatch('auth_getGeolocation')
			info.gl = {
				accuracy: coords.accuracy,
				altitude: coords.altitude,
				heading: coords.heading,
				latitude: coords.latitude,
				longitude: coords.longitude,
				speed: coords.speed
			}
		} catch (err) {
			console.warn(err)
			dispatch('notify', 'Не удалось получить ваше местоположение, вам нужно выбрать салон вручную.')
		}

		commit("auth_loadingPermissionsSet", true)
		let res = await api.auth.getPermissions(info)
		commit("auth_loadingPermissionsSet", false)
		if (res.data && res.data.error) return

		commit("auth_permissionsSet", res.data.permissions)
		commit("auth_salonsSet", res.data.salons)
	},
	auth_getGeolocation() {
		return new Promise((resolve, reject) => window.navigator.geolocation.getCurrentPosition(resolve, reject))
	}
}

const mutations = {
	updateUserAuth: (state, payload) => state.user = payload,
	updateToken (state, payload) {
		state.token = payload
		payload ? api.auth.setToken(payload) : api.auth.unsetToken()
	},
	auth_loadingSet: (state, payload) => state.loading.auth = payload,
	auth_loadingPermissionsSet: (state, payload) => state.loading.permissions = payload,
	auth_permissionsSet: (state, payload) => state.permissions = payload || [],
	auth_salonsSet: (state, payload) => state.salons = payload || [],
	auth_fromSet: (state, payload) => state.form[payload.type] = payload.data
}

const getters = {
	auth_permisiions: state => state.permissions,
	auth_form: state => state.form,
	logined: state => !!state.user && !!state.permissions && state.permissions.length,
	loginedAs: state => state.user,
	auchChecking: state => state.loading.auth || state.loading.permissions,
	currentUserSalon: state => state.user.ID_SALONA,
}

const modules = {
	settings
}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
