import api from '@/api'
import Infinite from '@/lib/Infinite'
import { Client } from '@/lib'
import select from '@/store/clients/select'

const state = {
	complete: false,
	infinite: false,
	filters: [],
	sort: [],
	cached: {
		list: [],
		current: {},
		byPhone: []
	},
	loading: {
		list: true,
		one: true,
		byPhone: false,
		bottom: false
	},
	edit: {
		contact: {}
	},
	visible: {
		addContactForm: false,
		editContactForm: false
	}
}

const actions = {
	async client_init ({ commit, dispatch, state }, payload) {
		if (payload) {
			dispatch('client_getOne', payload)
		} else {
			commit('client_initInfinite', new Infinite({
				method: api.clients.getLimited
			}))

			state.infinite.on('cached', n => commit('client_cacheSet', n))
			state.infinite.on('complete', n => commit('client_completeSet', n))

			await state.infinite.start()
		}
	},
	async client_sortChange({ commit, dispatch, state }, payload){
		commit("client_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async client_filtersChange({ commit, dispatch, state }, payload){
		commit("client_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async client_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
	},
	async client_getOne({ commit, dispatch }, payload){
		commit('client_loadingOneSet', true)
		let res = await api.clients.getOne(payload)
		commit('client_loadingOneSet', false)
		if (!res.data || res.data.error) return

		commit('client_currentSet', res.data)
	},
	async client_addContact({ commit, dispatch }, payload){
		let res = await api.clients.addContact(payload)
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		commit('preorder_currentContctAdd', res.data)
	},
	async client_update ({ commit, dispatch }, payload) {
		let res = await api.clients.update(payload)
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		commit('client_currentUpdate', res.data)
		commit('preorder_currentClientUpdate', res.data)
		dispatch('notify', 'Клиент успешно оновлён')
	},
	async client_updateContact({ commit, dispatch }, payload){
		let res = await api.clients.editContact(payload)
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		commit('client_currentContctUpdate', res.data)
		commit('preorder_currentContctUpdate', res.data)
		dispatch('notify', 'Контакное лицо успешно обновлено')
	}
}

const mutations = {
	client_destroy: state => state.cached.list = [],
	client_initInfinite: (state, payload) => state.infinite = payload,
	client_completeSet: (state, payload) => state.complete = payload,
	client_cacheSet: (state, payload) => state.cached.list = payload,
	client_byPhoneSet: (state, payload) => state.cached.byPhone = payload,
	client_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	client_filtersSet: (state, payload) => state.filters = payload,
	client_sortSet: (state, payload) => state.sort = payload,
	client_lastOffsetSet: (state, payload) => state.offset.last = payload,
	client_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	client_currentSet: (state, payload) => state.cached.current = payload instanceof Client ? payload : new Client(payload),
	client_currentUpdate: (state, payload) => state.cached.current ? state.cached.current.update(payload) : 0,
	client_currentContctUpdate: (state, payload) => api.core.assignItem(state.cached.current.contactfaces, payload),
	client_currentOffsetSet: (state, payload) => state.offset.current = payload || state.cached.list.length,
	client_loadingSet: (state, payload) => state.loading.list = payload,
	client_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	client_loadingOneSet: (state, payload) => state.loading.one = payload,
	client_loadingByPhoneSet: (state, payload) => state.loading.byPhone = payload,
	client_visible_addContactFormSet: (state, payload) => state.visible.addContactForm = payload,
	client_visible_editContactFormSet: (state, payload) => state.visible.editContactForm = payload,
	client_edit_contactSet: (state, payload) => state.edit.contact = payload,
}

const getters = {
	client_complete: state => state.complete,
	client_filters: ({ filters }) => filters,
	client_filtersPhone: ({ filters }) => filters.phone || "",
	client_current: ({ cached }) => cached.current,
	client_currentFIO: ({ cached }) => `${cached.current.lastname} ${cached.current.name}  ${cached.current.patronymic}`,
	client_cached: ({ cached }) => cached.list,
	client_byPhone: ({ cached }) => cached.byPhone,
	client_loading: ({ loading }) => loading.list,
	client_loadingBottom: ({ loading }) => loading.bottom,
	client_loadingOne: ({ loading }) => loading.one,
	client_loadingByPhone: ({ loading }) => loading.byPhone,
	client_edit_currentContact: ({ edit }) => edit.contact,
	client_visible_addContactForm: ({ visible }) => visible.addContactForm,
	client_visible_editContactForm: ({ visible }) => visible.editContactForm,
}



export default {
	state,
	actions,
	mutations,
	getters,
	modules: {
		select
	}
}
