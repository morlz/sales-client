import api from '@/api'
import moment from 'moment'
import groupBy from 'lodash.groupby'
import merge from 'lodash.merge'
import ReportAdSalon from '@/lib/reports/AdSalon'

const state = {
	cached: {
		list: {}
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
}

const mutations = {
	reports_ad_cacheSet: (state, payload) => {
		let salons = groupBy(payload, 'ID_SALON')
		state.cached = Object.keys(salons).map(salon_id => new ReportAdSalon(salons[salon_id], salon_id))
	},
	reports_ad_loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	reports_ad_dateSet: (state, payload) => state.date = { ...state.date, ...payload }
}

const getters = {

}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
