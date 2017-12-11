import api from '@/api'

const formatClient = ({ id, contactfaces, manager, salon, created_at }) => {
	let { fio, gender, phone } = contactfaces.find(el => el.regard == "Основной")
	return {
		id,
		fio,
		gender,
		manager: manager.FIO,
		salon: salon.NAME,
		created_at
	}
}


const state = {
	cached: [],
	filters: [],
	sort: [],
	filteredRows: [],
	current: 0,
	loading: true,
	oneLoading: true,
	loadingByPhone: false,
	searchByPhoneQuery: "",
	perLoadingLimit: 30
}

const actions = {
	clientsSortChanged({ commit, dispatch }, payload){
		commit("clearCachedClients")
		commit("clientsSortChange", payload)
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
		api.preorders.clients
			.getLimited({
				limit: state.perLoadingLimit,
				loadedIds: getters.clientsCachedIds,
				filters: state.filters,
				sort: state.sort
			})
			.then(({ data }) => {
				commit('updateCachedClients', data)
				commit('loadingClientsSet', false)
				payload.loaded()
				if (!data.length) payload.complete()
			})
	},
	getOneClient({ commit, dispatch }, payload){
		commit('setCurrentClient', payload)
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

				managerIDs = managerIDs.filter(unique)
				salonIDs = salonIDs.filter(unique)

				// --------------------------------------------
				// rewrite this

				managerIDs.forEach(id => dispatch('getOneManager', id))
				salonIDs.forEach(id => dispatch('getOneSalon', id))

				// ---------------------------------------------

				commit('updateCachedClients', [data])
				commit('oneLoadingClientSet', false)
			})
	},
	searchClientsByPhone({ commit, dispatch }, payload){
		commit('updateSearchByPhoneQuery', payload)
		if (!payload) return
		commit('loadingByPhoneClientsSet', true)
		api.preorders.clients
			.searchByPhone(payload)
			.then(({ data }) => {
				commit('updateCachedClients', data)
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
	}
}

const getters = {
	clientsCachedIds ({ cached }) {
		return cached.map(el => el.id)
	},
	currentClient({ cached, current }) {
		return cached.find(el => el.id == current) || {}
	},
	cachedClients({ cached }){
		return cached
	},
	cachedClientsFormated({ cached }){
		return cached.map(formatClient)
	},
	loadingClients({ loading }){
		return loading
	},
	oneLoadingClient({ oneLoading }){
		return oneLoading
	},
	clientsByPhone({ cached, searchByPhoneQuery }){
		return []//cached.filter(el => el.phone.indexOf(searchByPhoneQuery) + 1 || el.name.toLowerCase().indexOf(searchByPhoneQuery.toLowerCase()) + 1)
	},
	loadingClientsByPhone({ loadingByPhone }){
		return loadingByPhone
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}
