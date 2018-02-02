import api from '@/api'
import { Notification } from 'element-ui'
import { Toast, Alert } from 'quasar'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutRight.css'

const state = {

}

const actions = {
	notify ({ commit, dispatch }, payload) {
		if (typeof payload == 'object')
			Toast.create(payload.title + ' ' + payload.message)
		else
			Toast.create(payload)
		//Notification(payload)
	},
	alert (store, payload) {
		Alert.create({
			html: payload,
			enter: 'bounceInRight',
			leave: 'bounceOutRight',
		 })
	},
	catchErrorNotify ({ commit, dispatch }, payload) {
		dispatch('alert', `Код ошибки: ${payload.status} ${payload.message}`)
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
