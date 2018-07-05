import api from '@/api'
import { New, Chat, NewMessage } from '@/lib'
import moment from 'moment'

const state = {
	cached: {
		list: [],
		setup: [],
		current: false,
		chat: {}
	},
	loading: {
		list: false,
		chat: false
	},
	form: {
		id: null,
		modal: false
	}
}

const actions = {
	init ({ dispatch }) {
		dispatch('getAll')
	},
	destroy ({ commit }) {
		commit('changeChat', false)
	},
	refresh () {
		dispatch('getAll')
	},
	async getAll ({ commit, dispatch }) {
		commit('loadingSet', { list: true })
		let list = await New.getAll()
		commit('loadingSet', { list: false })
		if (!list || list.error) return

		commit('cacheSet', { list })
	},
	async getOne ({ commit, dispatch }, id) {
		commit('loadingSet', { current: true })
		let current = await New.getOne(id)
		commit('loadingSet', { current: false })
		if (!current || current.error) return

		commit('changeChat', new Chat(current))
	},
	async save ({ commit, dispatch }, nw) {
		let res = await nw.save()
		if (!res || res.error) return

		commit('cacheListAppendOrUpdate', res)
		commit('changeChat', new Chat(res))
	},
	async archive ({ commit, dispatch, getters }, nw) {
		let res = await nw.archivate()
		if (!res || res.error) return

		commit('removeOneFromCache', res.id)
		commit('cacheSet', { current: false })
	},
	async sendMessage ({ commit, dispatch, getters }, content) {
		let msg = new NewMessage({
			content,
			new_id: getters.current
		})
		let res = await msg.save()
		if (!res || res.error) return

		commit('appendChatMessage', res)
	}
}

const mutations = {
	cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	cacheListAppendOrUpdate: (state, payload) => state.cached.list = [
		...state.cached.list.filter(el => el.id != payload.id),
		payload
	],
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	changeChat: (state, payload) => {
		if (state.cached.chat instanceof Chat)
			state.cached.chat.destroy()

		state.cached.chat = payload
	},
	setFormId: (state, payload) => state.form.id = payload,
	toggleModalCreate: state => (state.form.modal = !state.form.modal, state.form.id = null),
	modalSet: (state, payload) => state.form.modal = payload,
	appendChatMessage: (state, payload) => state.cached.chat.appendMessage(payload),
	removeOneFromCache: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload)
}

const getters = {
	current: state => state.cached.current ? state.cached.current : (state.cached.list[0] || {}).id,
	cached: state => state.cached.list.sort( api.core.sortFnFactory( item => moment(item.date).valueOf() ) ),
}

export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true
}
