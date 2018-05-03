import api from '@/api'
import { Notification } from 'element-ui'
import { Notify } from 'quasar'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutRight.css'

const state = {

}

const actions = {
	notify ({ commit, dispatch }, payload) {
		Notify.create({
			message: typeof payload == 'object' ? payload.title + ' ' + payload.message : payload,
			type: 'positive',
			position: 'bottom-left'
		})
	},
	alert (store, payload) {
		Notify.create({
			message: payload,
			position: 'top-right',
			type: 'negative',
		 })
	},
	catchErrorNotify ({ commit, dispatch }, payload) {
		dispatch('alert', `Код ошибки: ${payload.status} ${payload.message}`)
	},
	handleFormErrors({ commit, dispatch }, payload) {
		for (var prop in payload)
			if (payload.hasOwnProperty(prop))
				dispatch('alert', payload[prop][0])
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
