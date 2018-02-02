import api from '@/api'

const state = {

}

const actions = {
	event_createHandlers ({ commit, dispatch }) {
		api.core.on("error", err => {
			console.log(err)

			let { title } = api.errors.getStatusDescription ( err.status ),
				notify = title ? title : `Ошибка ${err.status ? err.status : ''}` + err.message

			dispatch("alert", notify)
		})

		api.core.on('alert', payload => dispatch('notify', payload))
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
