import api from '@/api'
import { New, Chat, NewMessage } from '@/lib'

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

		let chat = new Chat(current)

		console.log(chat);

		commit('changeChat', chat)
	},
	async create ({ commit, dispatch }, nw) {
		let res = await nw.save()
		if (!res || res.error) return

		commit('cacheListAppend', [res])
	},
	archive () {

	},
	async sendMessage ({ commit, dispatch, getters }, content) {
		let msg = new NewMessage({
			content,
			new_id: getters.current
		})
		let res = await msg.save()
	}
}

const mutations = {
	cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	cacheListAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	changeChat: (state, payload) => {
		if (state.cached.chat instanceof Chat)
			state.cached.chat.destroy()

		state.cached.chat = payload
	},
}

const getters = {
	current: state => state.cached.current ? state.cached.current : (state.cached.list[0] || {}).id
}

export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true
}
