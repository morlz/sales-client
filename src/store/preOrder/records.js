import api from '@/api'

const state = {
	cached: [],
	filters: [],
	sort: [],
	statuses: [],
	current: 0,
	loading: true,
	loadingBottom: false,
	oneLoading: true,
	loadingByPhone: false,
	searchByPhoneQuery: "",
	perLoadingLimit: 30,
	offset: 0,
	lastOffset: -1,
}

const actions = {
	recordsSortChanged({ commit, dispatch }, payload){
		dispatch('recordsCacheClear')
		commit('changeRecordsLastOffset', -1)
		commit("recordsSortChange", payload)
	},
	recordsFiltersChange({ commit, dispatch }, payload){
		dispatch('recordsCacheClear')
		commit('changeRecordsLastOffset', -1)
		commit("recordsFiltersChange", payload)
	},
	recordsCacheClear({ commit, dispatch }){
		commit("clearCachedRecords")
		commit('setCurrentOffsetRecords')
		commit('loadingRecordsSet', true)
	},
	getAllRecords({ commit, dispatch }, ids){
		api.preorders.records
			.getAll(ids)
			.then(({ data }) => {
				commit('updateCachedRecords', data)
				commit('loadingRecordsSet', false)
			})
	},
	recordsInfinity({ commit, dispatch, state, getters }, payload){
		if (state.lastOffset == state.offset) return
		commit('changeRecordsLastOffset', state.offset)
		commit('loadingBottomRecordsSet', true)
		api.preorders.records
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset,
				filters: getters.recordFIlters,
				sort: state.sort
			})
			.then(({ data }) => {
				commit('updateCachedRecords', data)
				commit('loadingRecordsSet', false)
				commit('loadingBottomRecordsSet', false)
				commit('setCurrentOffsetRecords')
				payload.loaded()
				if (!data.length) payload.complete ()
			})
	},
	getOneRecord({ commit, dispatch }, payload){
		commit('oneLoadingRecordSet', true)
		api.preorders.records
			.getOne(payload)
			.then(({ data }) => {
				const unique = (value, index, self) => self.indexOf(value) === index
				let salonIDs = []

				data.tasks.forEach(task => {
					salonIDs.push(task.salon_id)
				})

				dispatch('getSalonsByIds', salonIDs.filter(unique))
				commit('setCurrentRecord', data)
				commit('oneLoadingRecordSet', false)
			})
	},
	searchRecordsByPhone({ commit, dispatch }, payload){
		commit('updateSearchByPhoneQuery', payload)
		if (!payload) return
		commit('loadingByPhoneRecordsSet', true)
		api.preorders.records
			.searchByPhone(payload)
			.then(({ data }) => {
				commit('updateCachedRecords', data)
				commit('loadingByPhoneRecordsSet', false)
			})
	},
	getAllRecordStatuses ({ commit, dispatch }) {
		api.preorders.records
			.getSatuses()
			.then(({ data }) => {
				commit('setPreorderStatuses', data)
			})
	}

}

const mutations = {
	changeRecordsLastOffset (store, payload = -1) {
		store.lastOffset = payload
	},
	clearCachedRecords (store, payload){
		store.cached = []
	},
	recordsFiltersChange (store, payload) {
		store.filters = payload
	},
	recordsSortChange (store, payload) {
		store.sort = payload
	},
	filtredRowsChange (store, payload) {
		store.filteredRows = payload
	},
	updateCachedRecords(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	updateCachedRecord(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el2 => el2.id != id)
		store.cached.push(payload)
	},
	removeCachedRecords(store, payload){
		payload.map(data => {
			let id = data.id || data
			store.cached = store.cached.filter(el => el.id != id)
		})
	},
	removeCachedRecord(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el => el.id != id)
	},
	loadingRecordsSet(store, payload) {
		store.loading = payload
	},
	loadingBottomRecordsSet(store, payload) {
		store.loadingBottom = payload
	},
	oneLoadingRecordSet(store, payload){
		store.oneLoading = payload
	},
	loadingByPhoneRecordsSet(store, payload) {
		store.loadingByPhone = payload
	},
	updateRecordsSearchByPhoneQuery(store, payload) {
		state.searchByPhoneQuery = payload
	},
	setCurrentRecord(store, payload) {
		store.current = payload
	},
	setCurrentOffsetRecords(store, payload) {
		store.offset = payload || store.cached.length
	},
	setPreorderStatuses(store, payload){
		store.statuses = payload
	}
}

const getters = {
	recordsCachedIds: ({ cached }) => cached.map(el => el.id),
	currentRecord: ({ cached, current }) => current,
	cachedRecords: ({ cached }) => cached,
	loadingRecords: ({ loading }) => loading,
	loadingBottomRecords: ({ loadingBottom }) => loadingBottom,
	oneLoadingRecord: ({ oneLoading }) => oneLoading,
	recordsByPhone: ({ cached, searchByPhoneQuery }) => [], //cached.filter(el => el.phone.indexOf(searchByPhoneQuery) + 1 || el.name.toLowerCase().indexOf(searchByPhoneQuery.toLowerCase()) + 1),
	loadingRecordsByPhone: ({ loadingByPhone }) => loadingByPhone,
	recordFIlters: ({ searchByPhoneQuery: phone, filters }) => Object.assign({ phone }, filters),
	recordStatuses: ({ statuses }) => statuses,
	newPreorderAccepted: ({ searchByPhoneQuery, cached, loading }) => searchByPhoneQuery.length && !loading
}

export default {
	state,
	actions,
	mutations,
	getters
}
