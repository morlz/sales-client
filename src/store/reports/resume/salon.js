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
	loading: {
		inner: false,
		all: false
	},
	salon: null
}

const actions = {
	async report_resume_salon_init ({ commit, dispatch }) {
		await dispatch('reports_resume_getAll')
		//await dispatch('salon_getList', null, { root: true })
	},
	async reports_resume_salon_getAll ({ commit, dispatch, state }) {
		commit('reports_resume_loadingSet', { type: 'all', data: true })
		let res = await api.reports.getResume({
			date: state.date
		})
		commit('reports_resume_loadingSet', { type: 'all', data: false })

		if (!res.data || res.data.error) return

		commit('reports_resume_cachedSet', { type: 'all', data: res.data })
	},
	async report_resume_salon_dateSet ({ commit, dispatch }, payload) {
		commit('report_resume_dateSet', payload)
		await dispatch('reports_resume_getAll')
	}
}

const mutations = {
	report_resume_dateSet: (state, payload) => state.date = moment(payload),
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
