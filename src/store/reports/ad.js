import api from '@/api'
import moment from 'moment'
import groupBy from 'lodash.groupby'
import merge from 'lodash.merge'
import ReportAdSalon from '@/lib/reports/AdSalon'

const state = {
	cached: {
		list: [],
		adSources: {}
	},
	loading: {
		list: false
	},
	date: {
		from: moment().subtract(3, 'month').toString(),
		to: moment().toString()
	},
}

const actions = {
	async reports_ad_init ({ dispatch }) {
		await dispatch('reports_ad_getList')
	},
	reports_ad_destroy ({ commit }) {
		commit('reports_ad_cacheSet', [])
	},
	async reports_ad_getList ({ commit, dispatch, state }) {
		commit('reports_ad_loadingSet', { list: true })
		let res = await api.reports.getAdList(state.date)
		commit('reports_ad_loadingSet', { list: false })
		if (!res.data || res.data.error) return

		commit('reports_ad_cacheSet', res.data)
	},
	async reports_ad_dateSet ({ commit, dispatch }, payload) {
		commit('reports_ad_dateSet', payload)
		dispatch('reports_ad_getList')
	},
	async reports_ad_exportToExcel ({ commit, dispatch }, content) {
		dispatch('notify', 'Создание файла', { root: true })
		dispatch('files/file_download', {
			filename: 'ExcelFile.xls',
			content
		}, { root: true })
	}
}

const mutations = {
	reports_ad_cacheSet: (state, payload) => {
		state.cached.adSources = payload.reduce((prev, el) => (prev[+el.REKLAMA_ID] = el.adSource, prev), {})
		let salons = groupBy(payload, 'ID_SALON')
		state.cached.list = Object.keys(salons).map(salon_id => new ReportAdSalon(salons[salon_id], salon_id))
	},
	reports_ad_loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	reports_ad_dateSet: (state, payload) => state.date = { ...state.date, ...payload }
}

const getters = {
	reports_ad_summ: state =>
		state.cached.list.map(salon =>
			Object.values(salon.adSources).reduce(
				(prev, adSource) => prev + adSource.invoicesPriceSumm, 0
			)
		),
	reports_ad_count: state => state.cached.list.map(salon => salon.invoices.length),
	reports_ad_summResult: (state, getters) => {
		let res = Object.keys(state.cached.adSources).reduce((prev, el) => (prev[el] = 0, prev), {})

		state.cached.list.forEach(
			salon => Object.keys(salon.adSources).map(
				adSourceId => res[adSourceId] += salon.adSources[adSourceId].invoicesPriceSumm
			)
		)

		return res
	},
	reports_ad_countResult: state => {
		let res = Object.keys(state.cached.adSources).reduce((prev, el) => (prev[el] = 0, prev), {})

		state.cached.list.forEach(
			salon => Object.values(salon.adSources).map(
				adSource => res[adSource.id] += adSource.invoiceCount
			)
		)

		return res
	},
	reports_ad_summResultAll: (state, getters) =>
		Object.values(getters.reports_ad_summResult).reduce((prev, el) => prev + el, 0),
	reports_ad_countResultAll: (state, getters) =>
		Object.values(getters.reports_ad_countResult).reduce((prev, el) => prev + el, 0),
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
