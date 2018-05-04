import api from '@/api'
import { AdSource } from '@/lib'

const state = {
	cached: {
		list: []
	},
	loading: {
		list: false
	}
}

const actions = {
	async adSource_getList({ commit, dispatch, state }){
		if (state.cached.list.length) return

		commit('adSource_loadingSet', { list: true })
		let res = await api.preorders.getAdSources()
		commit('adSource_loadingSet', { list: false })
		if (!res.data || res.data.error) return

		commit('adSource_cacheSet', { list: res.data.map(el => el instanceof AdSource ? el : new AdSource(el)) })
	},
}

const mutations = {
	adSource_loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	adSource_cacheSet: (state, payload) => state.cached = { ...state.cached, ...payload },
}

const getters = {
	adSource_list: state => state.cached.list,
	adSource_listSelect: state => state.cached.list.map(el => ({ label: el.NAME, value: el.ID })),
}

export default {
	state,
	actions,
	mutations,
	getters
}
