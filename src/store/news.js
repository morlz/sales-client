import api from '@/api'
import { New, Chat, NewMessage, SalonGroup } from '@/lib'
import moment from 'moment'

const state = {
	cached: {
		list: [],
		groups: [],
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
	async init ({ dispatch }) {
		return await Promise.all([
			dispatch('getAll'),
			dispatch('getGroups')
		])
	},
	destroy ({ commit }) {
		commit('cacheSet', {
			list: []
		})
	},
	destroyChat ({ commit }) {
		commit('changeChat', false)
	},
	refresh () {
		dispatch('getAll')
	},
	async getGroups ({ commit, dispatch, state }) {
		if (state.cached.groups.length) return
		let groups = await SalonGroup.getList()
		if (!groups || groups.error) return

		commit('cacheSet', { groups })
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
		dispatch('getGroups')
		let current = await New.getOne(id)
		commit('loadingSet', { current: false })
		if (!current || current.error) return

		commit('changeChat', new Chat(current))

		await current.readed()
	},
	async save ({ commit, dispatch }, nw) {
		commit('modalSet', false)

		let res = await nw.save()
		if (!res || res.error) return

		router.push(`/news/${res.id}`)
		//commit('cacheListAppendOrUpdate', res)
		//commit('changeChat', new Chat(res))
	},
	async archive ({ commit, dispatch, getters }, nw) {
		let res = await nw.archivate()
		if (!res || res.error) return

		commit('removeOneFromCache', res.id)
		commit('cacheSet', { current: false })
	},
	async remove ({ commit, dispatch, getters }, nw) {
		let res = await nw.remove()
		if (!res || res.error) return

		commit('removeOneFromCache', res.id)
		commit('cacheSet', { current: false })
	},
	async sendMessage ({ commit, dispatch, getters }, { content, new_id }) {
		let msg = new NewMessage({ content, new_id })
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
	cached: state => state.cached.list
		.sort( api.core.sortFnFactory( item => moment(item.date).valueOf() ) )
		.sort( api.core.sortFnFactory( item => !!item.newMessagsCount ) )
		.sort( api.core.sortFnFactory( item => !item.view ) ),
}

export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true
}
