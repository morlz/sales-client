import api from '@/api'

const formatRecord = ({ id, fio, calc_summ, prepay_summ, status, manager, salon, created_at }) => {
	return {
		id,
		fio,
		created_at,
		status: status.title,
		manager: manager.FIO,
		salon: salon.NAME,
		calc_summ,
		prepay_summ
	}
}

const state = {
	cached: [],
	loading: true,
	currentLoading: true,
	statuses: []
}

const actions = {
	getAllRecords({ commit, dispatch }){
		api.preorders.records
			.getAll()
			.then(({ data }) => {
				commit('updateCachedRecords', data)
				commit('loadingRecordsSet', false)
			})
	},
	getOneRecord({ commit, dispatch }, payload){
		commit('setCurrentRecord', payload)
		commit('oneLoadingRecordSet', true)
		api.preorders.records
			.getOne(payload)
			.then(({ data }) => {
				commit('updateCachedRecords', [data])
				commit('oneLoadingRecordSet', false)
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
	oneLoadingRecordSet(store, payload) {
		store.currentLoading = payload
	},
	setPreorderStatuses(store, payload){
		store.statuses = payload
	},
	setCurrentRecord(store, payload){
		store.current = payload
	}
}

const getters = {
	currentRecord({ cached, current }) {
		return cached.find(el => el.id == current) || {}
	},
	cachedRecords({ cached }){
		return cached
	},
	cachedRecordsFormated({ cached }){
		return cached.map(formatRecord)
	},
	loadingRecords({ loading }){
		return loading
	},
	loadingurrentRecord({ currentLoading }){
		return currentLoading
	},
	recordStatuses({ statuses }){
		let rez = []
		statuses.map(status => {
			rez[status.id] = status
		})
		return rez
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}
