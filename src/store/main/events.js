import api from '@/api'

const state = {

}

const actions = {
	event_createHandlers ({ commit, dispatch }) {
		api.core.on("error", err => console.log(err) || dispatch("notify", { title: `Ошибка ${err.status}`, message: err.message }))
	},

}

const mutations = {

}

const getters = {

}

export default {
	state,
	actions,
	mutations,
	getters
}
