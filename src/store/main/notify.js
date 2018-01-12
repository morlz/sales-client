import api from '@/api'
import { Notification } from 'element-ui'

const state = {

}

const actions = {
	notify ({ commit, dispatch }, payload) {
		Notification(payload)
	},
	catchErrorNotify ({ commit, dispatch }, payload) {
		dispatch('notify', {
			title: "Код ошибки: " + payload.status,
			message: payload.message
		})
	},
	handleFormErrors({ commit, dispatch }, payload) {
		for (var prop in payload)
			if (payload.hasOwnProperty(prop))
				dispatch('notify', { title: "Ошибка", message: payload[prop][0] })
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
