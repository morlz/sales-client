import api from '@/api'

const state = {
	cached: [],
	cachedClientsByPhone: [],
	filters: [],
	sort: [],
	current: {},
	loading: true,
	loadingBottom: false,
	oneLoading: true,
	loadingByPhone: false,
	searchByPhoneQuery: "",
	perLoadingLimit: 30,
	offset: 0,
	addFormVisible: false,
	editFormVisible: false,
	currentEditedContact: {}
}

const actions = {
	clientsSortChanged({ commit, dispatch }, payload){
		dispatch('clientsCacheClear')
		commit("clientsSortChange", payload)
	},
	clientsFiltersChange({ commit, dispatch }, payload){
		dispatch('clientsCacheClear')
		commit("clientsFiltersChange", payload)
	},
	clientsCacheClear({ commit, dispatch }){
		commit("clearCachedClients")
		commit('setCurrentOffsetClients')
		commit('loadingClientsSet', true)
	},
	getAllClients({ commit, dispatch }, ids){
		api.preorders.clients
			.getAll(ids)
			.then(({ data }) => {
				commit('updateCachedClients', data)
				commit('loadingClientsSet', false)
			})
	},
	clientsInfinity({ commit, dispatch, state, getters }, payload){
		commit('loadingBottomClientsSet', true)
		api.preorders.clients
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset,
				filters: getters.clientFIlters,
				sort: state.sort
			})
			.then(({ data }) => {
				commit('updateCachedClients', data)
				commit('loadingClientsSet', false)
				commit('loadingBottomClientsSet', false)
				commit('setCurrentOffsetClients')
				payload.loaded()
				if (!data.length) payload.complete ()
			})
	},
	getOneClient({ commit, dispatch }, payload){
		commit('oneLoadingClientSet', true)
		api.preorders.clients
			.getOne(payload)
			.then(({ data }) => {
				const unique = (value, index, self) => self.indexOf(value) === index

				let managerIDs = [], salonIDs = []

				data.preorders.forEach(el => {
					managerIDs.push(el.manager_id)
					salonIDs.push(el.salon_id)
				})

				data.tasks.forEach(task => {
					salonIDs.push(task.salon_id)
				})

				dispatch('getManagersByIds', managerIDs.filter(unique))
				dispatch('getSalonsByIds', salonIDs.filter(unique))
				commit('setCurrentClient', data)
				commit('oneLoadingClientSet', false)
			})
	},
	searchClientsByPhone({ commit, dispatch }, payload){
		if (!payload) return
		commit('updateCachedClientsByPhone', [])
		commit('loadingByPhoneClientsSet', true)
		api.preorders.clients
			.searchByPhone(payload)
			.then(({ data }) => {
				commit('updateCachedClientsByPhone', data)
				commit('loadingByPhoneClientsSet', false)
			})
	},
}

const mutations = {
	clearCachedClients (store, payload){
		store.cached = []
	},
	clientsFiltersChange (store, payload) {
		store.filters = payload
	},
	clientsSortChange (store, payload) {
		store.sort = payload
	},
	filtredRowsChange (store, payload) {
		store.filteredRows = payload
	},
	updateCachedClients(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	updateCachedClient(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el2 => el2.id != id)
		store.cached.push(payload)
	},
	removeCachedClients(store, payload){
		payload.map(data => {
			let id = data.id || data
			store.cached = store.cached.filter(el => el.id != id)
		})
	},
	removeCachedClient(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el => el.id != id)
	},
	loadingClientsSet(store, payload) {
		store.loading = payload
	},
	loadingBottomClientsSet(store, payload) {
		store.loadingBottom = payload
	},
	oneLoadingClientSet(store, payload){
		store.oneLoading = payload
	},
	loadingByPhoneClientsSet(store, payload) {
		store.loadingByPhone = payload
	},
	updateSearchByPhoneQuery(store, payload) {
		state.searchByPhoneQuery = payload
	},
	setCurrentClient(store, payload) {
		store.current = payload
	},
	setCurrentEditedContact(store, payload){
		store.currentEditedContact = payload
	},
	setCurrentOffsetClients(store, payload) {
		store.offset = payload || store.cached.length
	},
	updateAddClientContactFormVisible(store, payload){
		store.addFormVisible = payload
	},
	updateEditClientContactFormVisible(store, payload){
		store.editFormVisible = payload
	},
	updateCachedClientsByPhone(store, payload){
		store.cachedClientsByPhone = payload
	}
}

const getters = {
	clientsCachedIds ({ cached }) {
		return cached.map(el => el.id)
	},
	currentClient({ current }) {
		return current
	},
	cachedClients({ cached }){
		return cached
	},
	loadingClients({ loading }){
		return loading
	},
	loadingBottomClients({ loadingBottom }){
		return loadingBottom
	},
	oneLoadingClient({ oneLoading }){
		return oneLoading
	},
	clientsByPhone({ cachedClientsByPhone }){
		return cachedClientsByPhone
	},
	loadingClientsByPhone({ loadingByPhone }){
		return loadingByPhone
	},
	clientFIlters ({ searchByPhoneQuery: phone, filters }) {
		return Object.assign({ phone }, filters)
	},
	addClientContactFormVisible ({ addFormVisible }) {
		return addFormVisible
	},
	editClientContactFormVisible ({ editFormVisible }) {
		return editFormVisible
	},
	currentEditedContact ({ currentEditedContact }) {
		return currentEditedContact
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}
