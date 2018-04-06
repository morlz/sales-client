import api from '@/api'
import { dom } from 'quasar'
import fromatTitle from '@/lib/formatTitle.js'


import nav from '@/store/main/nav'
import files from '@/store/main/files'
import auth from '@/store/main/auth'
import notify from '@/store/main/notify'
import events from '@/store/main/events'



const state = {
	viewport: {
		width: dom.style(document.body, 'width').replace(/[^.\d]+/g,""),
		height: dom.style(document.body, 'height').replace(/[^.\d]+/g,""),
	},
	layout: {
		header: {
			shadow: true
		}
	}
}

const actions = {
	app_init ({ commit, dispatch, rootState }) {
		dispatch('event_createHandlers')
		dispatch('auth_init')
		commit('app_titleUpdate', rootState.route.meta.name)
	},
}

const mutations = {
	app_view_resize: (state, payload) => state.viewport = payload,
	app_titleUpdate: (state, payload) => document.title = fromatTitle(payload),
	app_layout_headerShadowSet: (state, payload) => state.layout.header.shadow = payload
}

const getters = {
	app_view_width: state => state.viewport.width,
	app_view_desktop: (state, getters) => getters.app_view_width > 996,
	app_view_tablet: (state, getters) => getters.app_view_width <= 996 && getters.app_view_width > 650,
	app_view_mobile: (state, getters) => getters.app_view_width <= 650,
	app_layout_headerShadow: state => state.layout.header.shadow
}

const modules = {
	nav,
	auth,
	notify,
	events,
	files
}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
