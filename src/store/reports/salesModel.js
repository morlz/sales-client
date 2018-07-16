import api from '@/api'
import moment from 'moment'
import { ReportSalesModel } from '@/lib/reports'

const colors = [
	"rgba(54, 162, 235, 0.7)",
	"rgba(75, 192, 192, 0.7)",
	"rgba(201, 203, 207, 0.7)",
	"rgba(255, 159, 64, 0.7)",
	"rgba(153, 102, 255, 0.7)",
	"rgba(255, 99, 132, 0.7)",
	"rgba(255, 205, 86, 0.7)"
]

const state = {
	cached: {},
	loading: false
}

const actions = {
	async report_salesModel_init ({ commit, dispatch, getters, state }) {
		if (getters.report_salesModel_loading || state.cached == {}) return
		await dispatch('report_salesModel_getData')
	},
	report_salesModel_destroy ({ commit }) {
		commit('report_salesModel_cachedSet', {})
		commit('report_salesModel_loaingSet', false)
	},
	async report_salesModel_getData ({ commit, dispatch }) {
		commit('report_salesModel_loaingSet', true)
		let res = await ReportSalesModel.get()
		console.log(res);
		commit('report_salesModel_loaingSet', false)

		if (!res || res.error) return

		commit('report_salesModel_cachedSet', res)
	},
}

const mutations = {
	report_salesModel_cachedSet: (state, payload) => state.cached = payload,
	report_salesModel_loaingSet: (state, payload) => state.loading = payload,
}

const getters = {
	report_salesModel_cached: state => state.cached.chart,
	report_salesModel_loading: state => state.loading,
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
