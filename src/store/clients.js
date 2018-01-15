import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
		byPhone: []
	},
	offset: {
		current: 0,
		last: -1
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
	client_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('client_getOne', payload)
		} else {
			dispatch('client_infinityStart')
		}
	},
	client_sortChange({ commit, dispatch }, payload){
		commit("client_sortSet", payload)
		dispatch('client_infinityStart')
	},
	client_filtersChange({ commit, dispatch }, payload){
		commit("client_filtersSet", payload)
		dispatch('client_infinityStart')
	},
	client_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('client_lastOffsetSet', state.offset.current)
		commit('client_loadingBottomSet', true)
		api.clients
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.client_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('client_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('client_loadingSet', false)
				commit('client_loadingBottomSet', false)
				commit('client_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	client_infinityStart({ commit, dispatch, state, getters }){
		commit('client_lastOffsetSet', -1)
		commit('client_loadingBottomSet', true)
		commit('client_loadingSet', true)
		api.clients
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.client_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('client_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('client_loadingBottomSet', false)
				commit('client_loadingSet', false)
				commit('client_currentOffsetSet')
			})
	},
	client_getOne({ commit, dispatch }, payload){
		commit('client_loadingOneSet', true)
		api.clients
			.getOne(payload)
			.then(({ data }) => {
				commit('client_currentSet', data)
				commit('client_loadingOneSet', false)
			})
	},
	client_addContact({ commit, dispatch }, payload){
		api.clients
			.addContact(payload)
			.then(({ data }) => {
				if (data.error) return
				if (data.errors) dispatch('handleFormErrors', data.errors)

				commit('preorder_currentContctAdd', data)
			})
	},
	client_updateContact({ commit, dispatch }, payload){
		api.clients
			.editContact(payload)
			.then(({ data }) => {
				if (data.error) return
				if (data.errors) dispatch('handleFormErrors', data.errors)

				commit('client_currentContctUpdate', data)
				commit('preorder_currentContctUpdate', data)
			})
	},
	client_searchByPhone({ commit, dispatch }, payload){
		if (!payload) {
			commit("client_byPhoneSet", [])
			return
		}
		commit("client_loadingByPhoneSet", true)
		api.clients
			.searchByPhone(payload)
			.then(({ data }) => {
				if (!data.error) {
					commit("client_byPhoneSet", data)
					commit("client_loadingByPhoneSet", false)
				}
			})
	},
}

const mutations = {
	client_cacheSet: (state, payload) => state.cached.list = payload,
	client_byPhoneSet: (state, payload) => state.cached.byPhone = payload,
	client_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	client_filtersSet: (store, payload) => store.filters = payload,
	client_sortSet: (store, payload) => store.sort = payload,
	client_lastOffsetSet: (store, payload) => store.offset.last = payload,
	client_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	client_currentSet: (store, payload) => store.cached.current = payload,
	client_currentContctUpdate: (store, payload) => api.core.assignItem(store.cached.current.contactfaces, payload),
	client_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	client_loadingSet: (store, payload) => store.loading.list = payload,
	client_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	client_loadingOneSet: (store, payload) => store.loading.one = payload,
	client_loadingByPhoneSet: (store, payload) => store.loading.byPhone = payload,
	client_visible_addContactFormSet: (store, payload) => store.visible.addContactForm = payload,
	client_visible_editContactFormSet: (store, payload) => store.visible.editContactForm = payload,
	client_edit_contactSet: (store, payload) => store.edit.contact = payload,
}

const getters = {
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
	getters
}
