import api from '@/api'

const state = {
	cached: [],
	loading: true
}

const actions = {
	getOneManager({ commit, dispatch }, payload){
		commit('loadingManagersSet', true)
		api.preorders.managers
			.getOne(payload)
			.then(({ data }) => {
				commit('updateCachedManagers', [data])
				commit('loadingManagersSet', false)
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
	loadingManagersSet(store, payload) {
		store.loading = payload
	}
}

const getters = {
	cachedManagers({ cached }){
		return cached
	},
	loadingManagers({ loading }){
		return loading
	},
}

export default {
	state,
	actions,
	mutations,
	getters
}
