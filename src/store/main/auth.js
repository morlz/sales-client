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
		showModels: true
	}
}

const actions = {
	authInit ({ commit, dispatch }) {
		let { token } = api.cookie.getAuth()
		if (token) {
			commit("updateToken", token)
			commit("auth_loadingSet", true)
		} else {
			commit("updateToken", "")
			return
		}

		api.auth
			.getUserData()
			.then(res => {
				if (res && res.data && res.data.token) {
					commit("updateUserAuth", res.data)
					commit("updateToken", res.data.token)
					dispatch("auth_getPermissions")
				}
				commit("auth_loadingSet", false)
			})
	},
	signIn ({ commit, dispatch }, payload) {
		api.auth
			.signIn(payload)
			.then(res => {
				if (res && res.data && res.data.token) {
					commit("updateUserAuth", res.data)
					commit("updateToken", res.data.token)
					dispatch("auth_getPermissions")
				}
				if (res && res.data && res.data.error) dispatch('catchErrorNotify', res.data.error)
			})
	},
	signUp () {

	},
	logOut ({ commit, dispatch }) {
		api.auth
			.logOut()
			.then(({ data }) => {
				console.log(data);
			})
		commit("updateUserAuth", false)
		commit("auth_permissionsSet", [])
		commit("updateToken", "")
	},
	auth_getPermissions ({ commit, dispatch }) {
		commit("auth_loadingPermissionsSet", true)
		api.auth
			.getPermissions()
			.then(res => {
				if (res.data.error) return

				commit("auth_permissionsSet", res.data)
				commit("auth_loadingPermissionsSet", false)
			})
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
	auth_permissionsSet: (state, payload) => state.permissions = payload,
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
