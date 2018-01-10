import api from '@/api'

const state = {
	user: false,
	token: "",
	auchChecking: false
}

const actions = {
	authInit ({ commit, dispatch }) {
		let { token } = api.cookie.getAuth()
		if (token) {
			commit("updateToken", token)
			commit("auchCheckingChange", true)
		} else {
			commit("updateToken", "")
			return
		}

		api.auth.getUserData()
			.then(res => {
				if (res && res.data && res.data.token) {
					commit("updateUserAuth", res.data)
					commit("updateToken", res.data.token)
				}
				commit("auchCheckingChange", false)
			})
	},
	signIn ({ commit, dispatch }, payload) {
		api.auth.signIn(payload)
			.then(({ data }) => {
				if (data && data.token) {
					commit("updateUserAuth", data)
					commit("updateToken", data.token)
				}
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	signUp () {

	},
	logOut ({ commit, dispatch }) {
		api.auth.logOut()
			.then(({ data }) => {
				console.log(data);
			})
		commit("updateUserAuth", false)
		commit("updateToken", "")
	}
}

const mutations = {
	updateUserAuth (state, payload) {
		state.user = payload
	},
	updateToken (state, payload) {
		state.token = payload
		api.cookie.setAuth({ token: payload })
	},
	auchCheckingChange (state, payload) {
		state.auchChecking = payload
	}
}

const getters = {
	logined: state => !!state.user,
	loginedAs: state => state.user,
	auchChecking: state => state.auchChecking,
	currentUserSalon: state => state.user.ID_SALONA,
}

export default {
	state,
	actions,
	mutations,
	getters
}
