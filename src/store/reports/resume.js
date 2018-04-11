import api from '@/api'
import moment from 'moment'
import sortWithRotate from '@/lib/sortWithRotate'
import groupBy from 'lodash.groupby'
import ResumeSalon from '@/lib/reports/ResumeSalon'

const state = {
	cached: {
		all: []
	},
	sort: {
		salon: null,
		month: 0
	},
	date: moment(),
	loading: {
		inner: false,
		all: false
	},
	salonNameFilter: "",
	hover: {
		row: -1,
		column: -1
	}
}

const actions = {
	async report_resume_all_init ({ commit, dispatch }) {
		await dispatch('reports_resume_getAll')
		//await dispatch('salon_getList', null, { root: true })
	},
	async report_resume_all_destroy ({ commit, dispatch }) {
		commit('report_resume_sortSalonSet', null)
		commit('report_resume_hoverSet', { type: 'row', data: -1 })
		commit('report_resume_hoverSet', { type: 'column', data: -1 })
		commit('report_resume_salonNameFilterSet', '')
	},
	async reports_resume_getAll ({ commit, dispatch, state }) {
		commit('reports_resume_loadingSet', { type: 'all', data: true })
		let res = await api.reports.getResume({
			date: state.date
		})
		commit('reports_resume_loadingSet', { type: 'all', data: false })

		if (!res.data || res.data.error) return

		commit('reports_resume_cachedSet', { type: 'all', data: res.data })
	}
}

const mutations = {
	report_resume_sortMonthSet: (state, payload) => state.sort.month = state.sort.month == payload ? -payload : payload,
	report_resume_sortSalonSet: (state, payload) => (state.sort.salon = state.sort.salon == payload ? -payload : +payload, state.sort.month = 0),
	report_resume_salonNameFilterSet: (state, payload) => state.salonNameFilter = payload,
	report_resume_hoverSet: (state, payload) => state.hover[payload.type] = payload.data,
	reports_resume_loadingSet: (state, payload) => state.loading[payload.type] = payload.data,
	reports_resume_cachedSet: (state, payload) => {
		let res = [],
			grouped = groupBy(payload.data, el => +el.ID_SALON)

		for (var salon_id in grouped)
			if (grouped.hasOwnProperty(salon_id))
				res.push(new ResumeSalon(grouped[salon_id], state.date))


		console.log(res)
		state.cached[payload.type] = res
	},
}

const getters = {
	reports_resume_currentDate: state => state.date,
	reports_resume_currentMonthLength: state => state.date.daysInMonth(),
	reports_resume_currentSortSalon: (state, getters, rootState, rootGetters) =>
		state.sort.salon ?
			(
				Math.abs(state.sort.salon) == 999 ?
					{ index: getters.reports_resume_data.length, direction: state.sort.salon > 0 }
				:	(
						state.sort.salon > 0 ?
							{ index: getters.reports_resume_data.findIndex(el => state.sort.salon == +el.id), direction: false }
						:	{ index: getters.reports_resume_data.findIndex(el => -state.sort.salon == +el.id), direction: true }
					)
			)
		:	{ index: 0, direction: true },
	reports_resume_currentSortMonth: (state, getters, rootState, rootGetters) =>
		state.sort.month ?
			(
				state.sort.month > 0 ?
					{ index: state.sort.month - 1, direction: true }
				:	{ index: -state.sort.month - 1, direction: false }
			)
		:	{ index: -1 },
	reports_resume_cached: (state, getters) => {
		let monthSumm = { name: 'ИТОГО:', id: "999", footer: true, months: Array.apply(null, { length: getters.reports_resume_currentMonthLength }) }

		getters.reports_resume_data.forEach(el => {
			el.months.forEach((month, index) => {

				if (!monthSumm.months[index])
					monthSumm.months[index] = 0

				monthSumm.months[index] += +month
			})
		})

		let res = [...getters.reports_resume_data, monthSumm]


		res = sortWithRotate(
			res,
			'months',
			item => item[getters.reports_resume_currentSortSalon.index],
			getters.reports_resume_currentSortSalon.direction
		)

		res = getters.reports_resume_currentSortMonth.index != -1 ?
			res.sort( api.core.sortFnFactory(
				item => item.months[getters.reports_resume_currentSortMonth.index],
				getters.reports_resume_currentSortMonth.direction
			) )
		:	res.sort( api.core.sortFnFactory(
				item =>
				item.id == '999' ?
					'яяяяяяяяя'
				:	item.name,
				true
			) )

		let monthNames = {
			title: true,
			months: Array
				.apply(null, { length: getters.reports_resume_currentMonthLength })
				.map((el, index) => index + 1)
		}

		getters.reports_resume_currentSortSalon.direction ?
			monthNames.months.push('ИТОГО:')
		:	monthNames.months.unshift('ИТОГО:')

		console.log(res);

		return [monthNames, ...res]
	},
	reports_resume_data: (state, getters, b, rootGetters) => state.cached.all
		.filter(el => el.name.toLowerCase().indexOf(state.salonNameFilter.toLowerCase()) + 1 || el.group.name.toLowerCase().indexOf(state.salonNameFilter.toLowerCase()) + 1),
	reports_resume_hover: state => state.hover,
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
