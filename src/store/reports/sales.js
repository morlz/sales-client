import api from '@/api'
import moment from 'moment'

class SofaModelListItem {
	constructor() {
		this.count = {
			podium: 0,
			storage: 0,
			order: 0
		}

		this.price = {
			podium: 0,
			storage: 0,
			order: 0
		}

		this.akc = {
			count: 0,
			price: 0
		}
	}

	get priceAll () {
		return Object.values(this.price).reduce((prev, el) => el + prev, 0)
	}

	get countAll () {
		return Object.values(this.count).reduce((prev, el) => el + prev, 0)
	}

	static summAllPrice (arr) {
		return {
			all: arr.reduce((prev, el) => prev + el.priceAll, 0),
			podium: arr.reduce((prev, el) => prev + el.price.podium, 0),
			storage: arr.reduce((prev, el) => prev + el.price.storage, 0),
			order: arr.reduce((prev, el) => prev + el.price.order, 0),
			akc: arr.reduce((prev, el) => prev + el.akc.price, 0)
		}
	}

	static summAllCount (arr) {
		return {
			all: arr.reduce((prev, el) => prev + el.countAll, 0),
			podium: arr.reduce((prev, el) => prev + el.count.podium, 0),
			storage: arr.reduce((prev, el) => prev + el.count.storage, 0),
			order: arr.reduce((prev, el) => prev + el.count.order, 0),
			akc: arr.reduce((prev, el) => prev + el.akc.count, 0)
		}
	}
}

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
	}
}

const mutations = {
	reports_sales_cachedSet: (state, payload) => state.cached = payload,
	reports_sales_dateFromSet: (state, payload) => state.date.from = payload,
	reports_sales_dateToSet: (state, payload) => state.date.to = payload,
	reports_sales_salonSet: (state, payload) => state.salon_id = payload === undefined ? payload : payload + "",
	reports_sales_loaingSet: (state, payload) => state.loading = payload,
}

const getters = {
	reports_sales_cached: state => {
		let list = {}

		for (var prop in state.cached)
			if (state.cached.hasOwnProperty(prop))
				state.cached[prop].map(el => {
					let model = el.Model || (el.MODEL + ' ' + el.TIP)
					if (!list[model])
						list[model] = new SofaModelListItem()

					list[model].count[prop] += +el.DCOUNT
					list[model].price[prop] += +el.SUMM_ZAL
					list[model].akc.count += +el.AKC || 0
					list[model].akc.price += +el.sAKC || 0
				})

		return list
	},
	reports_sales_loading: state => state.loading,
	reports_sales_summ: (state, getters) => {
		let list = Object.values(getters.reports_sales_cached)

		return {
			price: SofaModelListItem.summAllPrice(list),
			count: SofaModelListItem.summAllCount(list)
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
