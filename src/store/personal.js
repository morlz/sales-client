import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: true,
		bottom: false
	}
}

const actions = {
	personal_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('personal_getOne', payload)
		} else {
			dispatch('personal_infinityStart')
		}
	},
	personal_sortChange({ commit, dispatch }, payload){
		commit("personal_sortSet", payload)
		dispatch('personal_infinityStart')
	},
	personal_filtersChange({ commit, dispatch }, payload){
		commit("personal_filtersSet", payload)
		dispatch('personal_infinityStart')
	},
	personal_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('personal_lastOffsetSet', state.offset.current)
		commit('personal_loadingBottomSet', true)
		api.personals
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.personal_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('personal_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('personal_loadingSet', false)
				commit('personal_loadingBottomSet', false)
				commit('personal_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	personal_infinityStart({ commit, dispatch, state, getters }){
		commit('personal_lastOffsetSet', 0)
		commit('personal_loadingBottomSet', true)
		commit('personal_loadingSet', true)
		api.personals
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.personal_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('personal_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('personal_loadingBottomSet', false)
				commit('personal_loadingSet', false)
				commit('personal_currentOffsetSet')
			})
	},
	personal_getOne({ commit, dispatch }, payload){
		commit('personal_loadingOneSet', true)
		api.personals
			.getOne(payload)
			.then(({ data }) => {
				commit('personal_currentSet', data)
				commit('personal_loadingOneSet', false)
			})
	},
}

const mutations = {
	personal_cacheSet: (state, payload) => state.cached.list = payload,
	personal_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	personal_filtersSet: (store, payload) => store.filters = payload,
	personal_sortSet: (store, payload) => store.sort = payload,
	personal_lastOffsetSet: (store, payload) => store.offset.last = payload,
	personal_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	personal_currentSet: (store, payload) => store.cached.current = payload,
	personal_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	personal_loadingSet: (store, payload) => store.loading.list = payload,
	personal_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	personal_loadingOneSet: (store, payload) => store.loading.one = payload,
}

const getters = {
	personal_filters: ({ filters }) => filters,
	personal_current: ({ cached }) => cached.current,
	personal_cached: ({ cached }) => cached.list,
	personal_loading: ({ loading }) => loading.list,
	personal_loadingBottom: ({ loading }) => loading.bottom,
	personal_loadingOne: ({ loading }) => loading.one,
}

export default {
	state,
	actions,
	mutations,
	getters
}
