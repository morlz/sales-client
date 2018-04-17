import api from '@/api'
import moment from 'moment'
import sortWithRotate from '@/lib/sortWithRotate'
import groupBy from 'lodash.groupby'
import ResumeSalon from '@/lib/reports/ResumeSalon'
import hslToRgb from '@/lib/HSLtoRGB'

const state = {
	cached: {
		all: []
	},
	loading: {
		all: false
	}
}

const actions = {
	async reports_resume_allChart_init ({ commit, dispatch, state }) {
		if (state.cached.all.length) return
		await dispatch('reports_resume_allChart_getAll')
	},
	async reports_resume_allChart_getAll ({ commit, dispatch, state }) {
		commit('reports_resume_allChart_loadingSet', { all: true })
		let res = await api.reports.getResumeAllChart()
		commit('reports_resume_allChart_loadingSet', { all: false })

		if (!res.data || res.data.error) return

		console.log(res.data);

		commit('reports_resume_allChart_cacheSet', { all: res.data })
	}
}

const mutations = {
	reports_resume_allChart_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
	reports_resume_allChart_loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
}

const getters = {
	reports_resume_allChart_cache: (state, getters) => {
		let datasets = []

		Object.keys(state.cached.all).forEach((year, index) => {
			let el = state.cached.all[year]

			let data = el.months.map(month => month.summ)

			if (data.length < 12) {
				let emptyMonths = Array.apply(null, { length: 12 - data.length }).map(el => 0)
				data = index ?
					[...data, ...emptyMonths]
				:	[...emptyMonths, ...data]
			}

			datasets.push({
				data,
				label: year,
				backgroundColor: getters.reports_resume_allChart_colors[index]
			})
		})

		return {
			labels: moment.months(),
			datasets
		}
	},
	reports_resume_allChart_colors: state => Array.apply(null, { length: Object.keys(state.cached.all).length })
		.map(el => {
			let [r, g, b] = hslToRgb(Math.random(), 1, Math.random() * 0.5)
			return `rgba(${r}, ${g}, ${b}, 0.6)`
		})
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
