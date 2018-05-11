import api from '@/api'
import moment from 'moment'
import SalesSofaModel from '@/lib/reports/SalesSofaModel'

const state = {
	cached: {
		list: []
	},
	loading: {
		list: false
	}
}

const actions = {
	async reports_inventory_init ({ dispatch }) {
		await dispatch('reports_inventory_getList')
	},
	reports_inventory_destroy ({ commit }) {
		commit('reports_inventory_cacheSet', { list: [] })
	},
	async reports_inventory_getList ({ commit, dispatch }) {
		commit('reports_inventory_loadingSet', { list: true })
		let res = await api.reports.getInventoryList()
		commit('reports_inventory_loadingSet', { list: false })
		if (!res.data || res.data.error) return

		commit('reports_inventory_cacheSet', { list: res.data })
	},
	async reports_inventory_print ({ commit, dispatch, rootGetters }, content) {
		dispatch('print_run', {
			template: 'inventoryList',
			data: {
				salon: rootGetters.auth_currentSalon.NAME,
				manager: rootGetters.auth_user.fio,
				date: moment().format('DD-MM-YYYY'),
				content
			}
		}, { root: true })
	},
	async reports_inventory_exportToExcel ({ commit, dispatch }, content) {
		dispatch('files/file_download', {
			filename: 'ExcelFile.xls',
			content
		}, { root: true })
	}
}

const mutations = {
	reports_inventory_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	reports_inventory_loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload }
}

const getters = {
	reports_inventory_cached: state => state.cached.list.sort( api.core.sortFnFactory(item => item.furniture.MODEL, true) ),
	reports_inventory_loading: state => state.loading.list,
	reports_inventory_summ: state => state.cached.list.reduce((prev, el) => prev + el.price, 0)
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
