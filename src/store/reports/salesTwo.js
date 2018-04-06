import api from '@/api'
import moment from 'moment'
import SalesTwoItem from '@/lib/reports/SalesTwoItem'

const state = {
	salon_id: undefined,
	date: {
		from: moment().subtract(1, 'month').toString(),
		to: moment().toString()
	},
	cached: {},
	loading: false,
	groupByField: 'model',
	exportToExcelHtmlVisible: false
}

const actions = {
	async reports_salesTwo_init ({ commit, dispatch, rootGetters }) {
		commit('reports_salesTwo_salonSet', rootGetters.auth_currentSalon.ID_SALONA)
		await Promise.all([
			dispatch('salon_getList', null, { root: true }),
			dispatch('reports_salesTwo_getData')
		])
	},
	async reports_salesTwo_getData ({ commit, dispatch, state: { salon_id, date } }) {
		commit('reports_salesTwo_loaingSet', true)
		let res = await api.reports.getSalesTwo({
			salon_id,
			date
		})
		commit('reports_salesTwo_loaingSet', false)

		if (!res.data || res.data.error) return

		commit('reports_salesTwo_cachedSet', res.data)
	},
	async reports_salesTwo_dateFromSet ({ commit, dispatch }, payload) {
		commit('reports_salesTwo_dateFromSet', payload)
		await dispatch('reports_salesTwo_getData')
	},
	async reports_salesTwo_dateToSet ({ commit, dispatch }, payload) {
		commit('reports_salesTwo_dateToSet', payload)
		await dispatch('reports_salesTwo_getData')
	},
	async reports_salesTwo_salonSet ({ commit, dispatch }, payload) {
		commit('reports_salesTwo_salonSet', payload)
		await dispatch('reports_salesTwo_getData')
	},
	reports_salesTwo_exportToExcel ({ commit, dispatch }, content) {
		dispatch('files/file_downoad', {
			filename: 'ExcelFile.xls',
			content
		}, { root: true })
	}
}

const mutations = {
	reports_salesTwo_cachedSet: (state, payload) => state.cached = payload.map(el => new SalesTwoItem(el)),
	reports_salesTwo_dateFromSet: (state, payload) => state.date.from = payload,
	reports_salesTwo_dateToSet: (state, payload) => state.date.to = payload,
	reports_salesTwo_salonSet: (state, payload) => state.salon_id = payload === undefined ? payload : payload + "",
	reports_salesTwo_loaingSet: (state, payload) => state.loading = payload,
	reports_salesTwo_groupByFieldSet: (state, payload) => state.groupByField = payload,
	reports_salesTwo_exportExcelVisibleSet: (state, payload) => state.exportToExcelHtmlVisible = payload,
}

const getters = {
	reports_salesTwo_cached: state => SalesTwoItem.groupByField(state.cached, state.groupByField),
	reports_salesTwo_cachedAll: state => state.cached,
	reports_salesTwo_loading: state => state.loading,
	reports_salesTwo_exportExcelVisible: state => state.exportToExcelHtmlVisible
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
