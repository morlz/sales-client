import api from '@/api'

const state = {
	user: false,
	token: "",
	auchChecking: false
}

const actions = {
	authInit ({ commit, dispatch }) {
		let { token } = api.auth.cookie.getAuth()
		if (token) {
			commit("updateToken", token)
			commit("auchCheckingChange", true)
		} else {
			commit("updateToken", "")
			return
		}

		api.auth.getUserData()
			.then(({ data }) => {
				if (data.token) {
					commit("updateUserAuth", data)
					commit("updateToken", data.token)
				}
				commit("auchCheckingChange", false)
			})
	},
	signIn ({ commit, dispatch }, payload) {
		api.auth.signIn(payload)
			.then(({ data }) => {
				if (data.token) {
					commit("updateUserAuth", data)
					commit("updateToken", data.token)
				}
			})
	},
	signUp () {

	},
	logOut ({ commit, dispatch }) {
		/*
		api.auth.logOut()
			.then(({ data }) => {
				console.log(data);
				if (data.token)
			})
		*/

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
		api.auth.cookie.setAuth({ token: payload })
	},
	auchCheckingChange (state, payload) {
		state.auchChecking = payload
	}
}

const getters = {
	logined: state => !!state.user,
	loginedAs: state => state.user,
	auchChecking: state => state.auchChecking,
}

export default {
	state,
	actions,
	mutations,
	getters
}
