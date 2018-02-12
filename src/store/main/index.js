import api from '@/api'
import { dom } from 'quasar'


import nav from '@/store/main/nav'
import files from '@/store/main/files'
import auth from '@/store/main/auth'
import notify from '@/store/main/notify'
import events from '@/store/main/events'



const state = {
	viewport: {
		width: dom.style(document.body, 'width').replace(/[^.\d]+/g,""),
		height: dom.style(document.body, 'height').replace(/[^.\d]+/g,""),
	}
}

const actions = {

}

const mutations = {
	main_view_resize: (state, payload) => state.viewport = payload
}

const getters = {
	main_view_width: state => state.viewport.width,
	main_view_desktop: (state, getters) => getters.main_view_width > 996,
	main_view_mobile: (state, getters) => getters.main_view_width <= 996,
}

const modules = [
	nav,
	auth,
	notify,
	events
]

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
