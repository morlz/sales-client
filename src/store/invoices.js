import api from '@/api'

const state = {
	cached: [],
	cachedInvoicesByPhone: [],
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
	invoicesSortChanged({ commit, dispatch }, payload){
		dispatch('invoicesCacheClear')
		commit('changeInvoicesLastOffset', -1)
		commit("invoicesSortChange", payload)
	},
	invoicesFiltersChange({ commit, dispatch }, payload){
		dispatch('invoicesCacheClear')
		commit('changeInvoicesLastOffset', -1)
		commit("invoicesFiltersChange", payload)
	},
	invoicesCacheClear({ commit, dispatch }){
		commit("clearCachedInvoices")
		commit('setCurrentOffsetInvoices')
		commit('loadingInvoicesSet', true)
	},
	getAllInvoices({ commit, dispatch }, ids){
		api.invoices
			.getAll(ids)
			.then(({ data }) => {
				commit('updateCachedInvoices', data)
				commit('loadingInvoicesSet', false)
			})
	},
	invoicesInfinity({ commit, dispatch, state, getters }, payload){
		if (state.lastOffset == state.offset) return
		commit('changeInvoicesLastOffset', state.offset)
		commit('loadingBottomInvoicesSet', true)
		api.invoices
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset,
				filters: getters.invoiceFIlters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('updateCachedInvoices', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('loadingInvoicesSet', false)
				commit('loadingBottomInvoicesSet', false)
				commit('setCurrentOffsetInvoices')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	getOneInvoice({ commit, dispatch }, payload){
		commit('oneLoadingInvoiceSet', true)
		api.invoices
			.getOne(payload)
			.then(({ data }) => {
				commit('setCurrentInvoice', data)
				commit('oneLoadingInvoiceSet', false)
			})
	},
	searchInvoicesByPhone({ commit, dispatch }, payload){
		if (!payload) return
		commit('updateCachedInvoicesByPhone', [])
		commit('loadingByPhoneInvoicesSet', true)
		api.invoices
			.searchByPhone(payload)
			.then(({ data }) => {
				commit('updateCachedInvoicesByPhone', data)
				commit('loadingByPhoneInvoicesSet', false)
			})
	},
	invoiceAddContact({ commit, dispatch }, payload){
		api.invoices
			.addContact(payload)
			.then(({ data }) => {
				console.log(data);
			})
	},
	invoiceUpdateContact({ commit, dispatch }, payload){
		api.invoices
			.editContact(payload)
			.then(({ data }) => {
				console.log(data);
			})
	},
}

const mutations = {
	changeInvoicesLastOffset (store, payload) {
		store.lastOffset = payload
	},
	clearCachedInvoices (store, payload){
		store.cached = []
	},
	invoicesFiltersChange (store, payload) {
		store.filters = payload
	},
	invoicesSortChange (store, payload) {
		store.sort = payload
	},
	filtredRowsChange (store, payload) {
		store.filteredRows = payload
	},
	updateCachedInvoices(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	updateCachedInvoice(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el2 => el2.id != id)
		store.cached.push(payload)
	},
	removeCachedInvoices(store, payload){
		payload.map(data => {
			let id = data.id || data
			store.cached = store.cached.filter(el => el.id != id)
		})
	},
	removeCachedInvoice(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el => el.id != id)
	},
	loadingInvoicesSet(store, payload) {
		store.loading = payload
	},
	loadingBottomInvoicesSet(store, payload) {
		store.loadingBottom = payload
	},
	oneLoadingInvoiceSet(store, payload){
		store.oneLoading = payload
	},
	loadingByPhoneInvoicesSet(store, payload) {
		store.loadingByPhone = payload
	},
	updateSearchByPhoneQuery(store, payload) {
		state.searchByPhoneQuery = payload
	},
	setCurrentInvoice(store, payload) {
		store.current = payload
	},
	setCurrentEditedContact(store, payload){
		store.currentEditedContact = payload
	},
	setCurrentOffsetInvoices(store, payload) {
		store.offset = payload || store.cached.length
	},
	updateAddInvoiceContactFormVisible(store, payload){
		store.addFormVisible = payload
	},
	updateEditInvoiceContactFormVisible(store, payload){
		store.editFormVisible = payload
	},
	updateCachedInvoicesByPhone(store, payload){
		store.cachedInvoicesByPhone = payload
	}
}

const getters = {
	invoicesCachedIds: ({ cached }) => cached.map(el => el.id),
	currentInvoice: ({ current }) => current,
	cachedInvoices: ({ cached }) => cached,
	loadingInvoices: ({ loading }) => loading,
	loadingBottomInvoices: ({ loadingBottom }) => loadingBottom,
	oneLoadingInvoice: ({ oneLoading }) => oneLoading,
	invoicesByPhone: ({ cachedInvoicesByPhone }) => cachedInvoicesByPhone,
	loadingInvoicesByPhone: ({ loadingByPhone }) => loadingByPhone,
	invoiceFIlters: ({ filters }) => Object.assign({}, filters),
	addInvoiceContactFormVisible: ({ addFormVisible }) => addFormVisible,
	editInvoiceContactFormVisible: ({ editFormVisible }) => editFormVisible,
}

export default {
	state,
	actions,
	mutations,
	getters
}
