import api from '@/api'

const state = {
	user: false,
	permissions: [],
	token: "",
	loading: {
		auth: false,
		permissions: false
	},
	settings: {
		showModels: true,
		tileView: false
	}
}

const actions = {
	async authInit ({ commit, dispatch }) {
		let { token } = api.cookie.getAuth()
		commit("updateToken", token ? token : "")

		commit("auth_loadingSet", true)
		let res = await api.auth.getUserData()
		commit("auth_loadingSet", false)
		if (res.data && res.data.error) return
		if (res && res.data && res.data.token) {
			commit("updateUserAuth", res.data)
			commit("updateToken", res.data.token)
			await dispatch("auth_getPermissions")
		}
	},
	async signIn ({ commit, dispatch }, payload) {
		let res = await api.auth.signIn(payload)
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
		commit("updateToken", "")
	},
	async auth_getPermissions ({ commit, dispatch }) {
		commit("auth_loadingPermissionsSet", true)
		let res = await api.auth.getPermissions()
		commit("auth_loadingPermissionsSet", false)
		if (res.data && res.data.error) return
		commit("auth_permissionsSet", res.data)
	}
}

const mutations = {
	updateUserAuth: (state, payload) => state.user = payload,
	updateToken (state, payload) {
		state.token = payload
		api.cookie.setAuth({ token: payload })
	},
	auth_loadingSet: (state, payload) => state.loading.auth = payload,
	auth_loadingPermissionsSet: (state, payload) => state.loading.permissions = payload,
	auth_permissionsSet: (state, payload) => state.permissions = payload || [],
	auth_settings_showModelsSet: (state, payload) => state.settings.showModels = payload,
}

const getters = {
	auth_permisiions: state => state.permissions,
	logined: state => !!state.user && !!state.permissions && state.permissions.length,
	loginedAs: state => state.user,
	auchChecking: state => state.loading.auth || state.loading.permissions,
	currentUserSalon: state => state.user.ID_SALONA,
	auth_settings: state => state.settings,
}

export default {
	state,
	actions,
	mutations,
	getters
}
