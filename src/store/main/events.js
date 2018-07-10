import api from '@/api'

import { ClientError } from '@/lib'

const state = {

}

const actions = {
	event_createHandlers ({ commit, dispatch }) {
		api.core.on("error", err => {
			console.log('[events] [error]', err)

			if (err.status === 401)
				return dispatch('logOut')

			if (err.status === 403 && err.message == 'Неверный токен доступа')
				return dispatch('auth_sessionExpired')

			let { title } = api.errors.getStatusDescription ( err.status ),
				notify = (title ? title : `Ошибка ${err.status ? err.status : ''}`) + ' ' + err.message

			//let clientError = new ClientError({ msg: notify })
			//clientError.save()


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
