import api from '@/api'
import moment from 'moment'
import SalesSofaModel from '@/lib/reports/SalesSofaModel'

const state = {
	salon_id: undefined,
	date: {
		from: moment().subtract(1, 'month').toString(),
		to: moment().toString()
	},
	cached: {},
	loading: false
}

const actions = {
	async reports_sales_init ({ commit, dispatch, rootGetters }) {
		commit('reports_sales_salonSet', rootGetters.auth_currentSalon.ID_SALONA)
		await Promise.all([
			dispatch('salon_getList', null, { root: true }),
			dispatch('reports_sales_getData')
		])
	},
	reports_sales_destroy ({ commit }) {
		commit('reports_sales_cachedSet', {})
	},
	async reports_sales_getData ({ commit, dispatch, state: { salon_id, date } }) {
		commit('reports_sales_loaingSet', true)
		let res = await api.reports.getSales({
			salon_id,
			date
		})
		commit('reports_sales_loaingSet', false)

		if (!res.data || res.data.error) return

		commit('reports_sales_cachedSet', res.data)
	},
	async reports_sales_dateFromSet ({ commit, dispatch }, payload) {
		commit('reports_sales_dateFromSet', payload)
		await dispatch('reports_sales_getData')
	},
	async reports_sales_dateToSet ({ commit, dispatch }, payload) {
		commit('reports_sales_dateToSet', payload)
		await dispatch('reports_sales_getData')
	},
	async reports_sales_salonSet ({ commit, dispatch }, payload) {
		commit('reports_sales_salonSet', payload)
		await dispatch('reports_sales_getData')
	},
	reports_sales_exportToExcel ({ commit, dispatch }, content) {
		dispatch('files/file_download', {
			filename: 'ExcelFile.xls',
			content
		}, { root: true })
	}
}

const mutations = {
	reports_sales_cachedSet: (state, payload) => {
		let list = {}

		for (var prop in payload)
			if (payload.hasOwnProperty(prop))
				payload[prop].map(el => {
					let model = el.Model || (el.MODEL + ' ' + el.TIP)
					if (!list[model])
						list[model] = new SalesSofaModel()

					list[model].count[prop] += +el.DCOUNT
					list[model].price[prop] += +el.SUMM_ZAL
					list[model].akc.count += +el.AKC || 0
					list[model].akc.price += +el.sAKC || 0
				})

		state.cached = list
	},
	reports_sales_dateFromSet: (state, payload) => state.date.from = payload,
	reports_sales_dateToSet: (state, payload) => state.date.to = payload,
	reports_sales_salonSet: (state, payload) => state.salon_id = payload === undefined ? payload : payload + "",
	reports_sales_loaingSet: (state, payload) => state.loading = payload,
}

const getters = {
	reports_sales_cached: state => state.cached,
	reports_sales_loading: state => state.loading,
	reports_sales_summ: state => {
		let list = Object.values(state.cached)

		return {
			price: SalesSofaModel.summAllPrice(list),
			count: SalesSofaModel.summAllCount(list)
		}
	},
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
