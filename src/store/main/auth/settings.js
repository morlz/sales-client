import api from '@/api'

const state = {
	showModels: true,
	tileView: false
}

const actions = {
	async main_auth_settings_set ({ commit, dispatch }, payload) {
		commit('main_auth_settings_set', payload)
	}
}

const mutations = {
	main_auth_settings_set: (state, payload) => state[payload.type] = payload.data
}

const getters = {
	main_auth_settings: state => state,
}

const modules = {

}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
