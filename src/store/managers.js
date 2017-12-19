import api from '@/api'

const state = {
	cached: [],
	loading: true,
	current: {},
	currentLoading: true
}

const actions = {
	getOneManager({ commit, dispatch }, payload){
		commit('loadingManagersSet', true)
		api.managers
			.getOne(payload)
			.then(({ data }) => {
				commit('updateCachedManagers', [data])
				commit('loadingManagersSet', false)
			})
	},
	getManagersByIds({ commit, dispatch }, payload){
		commit('loadingManagersSet', true)
		api.managers
			.getByIds(payload)
			.then(({ data }) => {
				commit('updateCachedManagers', data)
				commit('loadingManagersSet', false)
			})
	},
	getManagerProfileById({ commit, dispatch }, payload) {
		api.managers
			.getManagerProfile(payload)
			.then(({ data }) => {
				commit("updateCurrentManager", data)
			})
	}
}

const mutations = {
	updateCachedManagers(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	loadingManagersSet: (store, payload) => store.loading = payload,
	updateCurrentManager: (store, payload) => store.current = payload
}

const getters = {
	cachedManagers: ({ cached }) => cached,
	loadingManagers: ({ loading }) => loading,
	currentManagerProfile: ({ current }) => current,
}

export default {
	state,
	actions,
	mutations,
	getters
}
