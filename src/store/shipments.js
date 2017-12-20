import api from '@/api'

const state = {
	cached: [],
	cachedShipmentsByPhone: [],
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
	lastOffset: -1,
	addFormVisible: false,
	editFormVisible: false,
	currentEditedContact: {}
}

const actions = {
	shipmentsSortChanged({ commit, dispatch }, payload){
		dispatch('shipmentsCacheClear')
		commit('changeShipmentsLastOffset', -1)
		commit("shipmentsSortChange", payload)
	},
	shipmentsFiltersChange({ commit, dispatch }, payload){
		dispatch('shipmentsCacheClear')
		commit('changeShipmentsLastOffset', -1)
		commit("shipmentsFiltersChange", payload)
	},
	shipmentsCacheClear({ commit, dispatch }){
		commit("clearCachedShipments")
		commit('setCurrentOffsetShipments')
		commit('loadingShipmentsSet', true)
	},
	getAllShipments({ commit, dispatch }, ids){
		api.shipments
			.getAll(ids)
			.then(({ data }) => {
				commit('updateCachedShipments', data)
				commit('loadingShipmentsSet', false)
			})
	},
	shipmentsInfinity({ commit, dispatch, state, getters }, payload){
		if (state.lastOffset == state.offset) return
		commit('changeShipmentsLastOffset', state.offset)
		commit('loadingBottomShipmentsSet', true)
		api.shipments
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset,
				filters: getters.shipmentFIlters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('updateCachedShipments', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('loadingShipmentsSet', false)
				commit('loadingBottomShipmentsSet', false)
				commit('setCurrentOffsetShipments')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	getOneShipment({ commit, dispatch }, payload){
		commit('oneLoadingShipmentSet', true)
		api.shipments
			.getOne(payload)
			.then(({ data }) => {
				commit('setCurrentShipment', data)
				commit('oneLoadingShipmentSet', false)
			})
	},
	searchShipmentsByPhone({ commit, dispatch }, payload){
		if (!payload) return
		commit('updateCachedShipmentsByPhone', [])
		commit('loadingByPhoneShipmentsSet', true)
		api.shipments
			.searchByPhone(payload)
			.then(({ data }) => {
				commit('updateCachedShipmentsByPhone', data)
				commit('loadingByPhoneShipmentsSet', false)
			})
	},
	shipmentAddContact({ commit, dispatch }, payload){
		api.shipments
			.addContact(payload)
			.then(({ data }) => {
				console.log(data);
			})
	},
	shipmentUpdateContact({ commit, dispatch }, payload){
		api.shipments
			.editContact(payload)
			.then(({ data }) => {
				console.log(data);
			})
	},
}

const mutations = {
	changeShipmentsLastOffset (store, payload) {
		store.lastOffset = payload
	},
	clearCachedShipments (store, payload){
		store.cached = []
	},
	shipmentsFiltersChange (store, payload) {
		store.filters = payload
	},
	shipmentsSortChange (store, payload) {
		store.sort = payload
	},
	filtredRowsChange (store, payload) {
		store.filteredRows = payload
	},
	updateCachedShipments(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	updateCachedShipment(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el2 => el2.id != id)
		store.cached.push(payload)
	},
	removeCachedShipments(store, payload){
		payload.map(data => {
			let id = data.id || data
			store.cached = store.cached.filter(el => el.id != id)
		})
	},
	removeCachedShipment(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el => el.id != id)
	},
	loadingShipmentsSet(store, payload) {
		store.loading = payload
	},
	loadingBottomShipmentsSet(store, payload) {
		store.loadingBottom = payload
	},
	oneLoadingShipmentSet(store, payload){
		store.oneLoading = payload
	},
	loadingByPhoneShipmentsSet(store, payload) {
		store.loadingByPhone = payload
	},
	updateSearchByPhoneQuery(store, payload) {
		state.searchByPhoneQuery = payload
	},
	setCurrentShipment(store, payload) {
		store.current = payload
	},
	setCurrentEditedContact(store, payload){
		store.currentEditedContact = payload
	},
	setCurrentOffsetShipments(store, payload) {
		store.offset = payload || store.cached.length
	},
	updateAddShipmentContactFormVisible(store, payload){
		store.addFormVisible = payload
	},
	updateEditShipmentContactFormVisible(store, payload){
		store.editFormVisible = payload
	},
	updateCachedShipmentsByPhone(store, payload){
		store.cachedShipmentsByPhone = payload
	}
}

const getters = {
	shipmentsCachedIds: ({ cached }) => cached.map(el => el.id),
	currentShipment: ({ current }) => current,
	cachedShipments: ({ cached }) => cached,
	loadingShipments: ({ loading }) => loading,
	loadingBottomShipments: ({ loadingBottom }) => loadingBottom,
	oneLoadingShipment: ({ oneLoading }) => oneLoading,
	shipmentsByPhone: ({ cachedShipmentsByPhone }) => cachedShipmentsByPhone,
	loadingShipmentsByPhone: ({ loadingByPhone }) => loadingByPhone,
	shipmentFIlters: ({ filters }) => Object.assign({}, filters),
	addShipmentContactFormVisible: ({ addFormVisible }) => addFormVisible,
	editShipmentContactFormVisible: ({ editFormVisible }) => editFormVisible,
}

export default {
	state,
	actions,
	mutations,
	getters
}
