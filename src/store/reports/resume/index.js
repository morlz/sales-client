import api from '@/api'
import moment from 'moment'
import sortWithRotate from '@/lib/sortWithRotate'
import groupBy from 'lodash.groupby'
import ResumeSalon from '@/lib/reports/ResumeSalon'
import salon from './salon'


const state = {
	cached: {
		all: []
	},
	sort: {
		type: 'salon',
		index: 0
	},
	date: moment(),
	loading: {
		inner: false,
		all: false
	},
	salonNameFilter: ""
}

const actions = {
	async reports_resume_all_init ({ commit, dispatch }) {
		await dispatch('reports_resume_getAll')
		//await dispatch('salon_getList', null, { root: true })
	},
	async reports_resume_all_destroy ({ commit, dispatch }) {
		commit('reports_resume_salonNameFilterSet', '')
	},
	async reports_resume_getAll ({ commit, dispatch, state }) {
		commit('reports_resume_loadingSet', { type: 'all', data: true })
		let res = await api.reports.getResume({
			date: state.date
		})
		commit('reports_resume_loadingSet', { type: 'all', data: false })

		if (!res.data || res.data.error) return

		commit('reports_resume_cachedSet', { type: 'all', data: res.data })
	},
	async reports_resume_dateSet ({ commit, dispatch }, payload) {
		commit('reports_resume_dateSet', payload)
		await dispatch('reports_resume_getAll')
	}
}

const mutations = {
	reports_resume_sortSet: (state, payload) => state.sort = { ...state.sort, ...payload, index: state.sort.index === payload.index ? -payload.index : payload.index },
	reports_resume_salonNameFilterSet: (state, payload) => state.salonNameFilter = payload,
	reports_resume_dateSet: (state, payload) => state.date = moment(payload),
	reports_resume_loadingSet: (state, payload) => state.loading[payload.type] = payload.data,
	reports_resume_cachedSet: (state, payload) => state.cached[payload.type] = Object.values(groupBy(payload.data, el => +el.ID_SALON))
		.map(salon => new ResumeSalon(salon, state.date)),
}

const getters = {
	reports_resume_currentDate: state => state.date,
	reports_resume_currentMonthLength: state => state.date.daysInMonth(),
	reports_resume_cached: (state, getters) => {
		let bestUids = ResumeSalon.best(getters.reports_resume_data)
		let res = getters.reports_resume_data.map(el => (el.best = bestUids.includes(el.uid), el))


		if (state.sort.type !== 'salon')
			res.sort( api.core.sortFnFactory(item => item.months[Math.abs(state.sort.index) - 1], !(state.sort.index < 0)) )
		else
			res.sort( api.core.sortFnFactory(item => item.name, !(state.sort.index < 0)) )

		return [
			getters.reports_resume_monthNamesRow,
			...res,
			getters.reports_resume_monthSumRow
		]
	},
	reports_resume_data: (state, getters, b, rootGetters) => state.cached.all
		.filter(el => el.name.toLowerCase().indexOf(state.salonNameFilter.toLowerCase()) + 1 || el.group.name.toLowerCase().indexOf(state.salonNameFilter.toLowerCase()) + 1)
		.sort( api.core.sortFnFactory(el => el.name, true) ),
	reports_resume_monthSumRow: (state, getters) => {
		let monthSumm = {
			name: 'ИТОГО:',
			__sort: 'end',
			id: 999,
			footer: true,
			months: Array
				.apply(null, { length: getters.reports_resume_currentMonthLength + 1 })
				.map(el => 0)
		}

		getters.reports_resume_data.forEach(el => el.months.forEach((month, index) => monthSumm.months[index] += +month))

		return monthSumm
	},
	reports_resume_monthNamesRow: (state, getters) => {
		let monthNames = {
			title: true,
			__sort: 'start',
			months: Array
				.apply(null, { length: getters.reports_resume_currentMonthLength })
				.map((el, index) => index + 1)
		}

		monthNames.months.push('ИТОГО:')

		return monthNames
	}
}

const modules = {
	salon
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters,
	modules
}
