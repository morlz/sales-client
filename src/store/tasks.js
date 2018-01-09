import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
		types: []
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: true,
		types: true,
		bottom: false
	},
	edit: {
		visible: false,
		current: {}
	}
}

const actions = {
	task_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('task_getOne', payload)
		} else {
			dispatch('task_infinityStart')
		}
	},
	task_sortChange({ commit, dispatch }, payload){
		commit("task_sortSet", payload)
		dispatch('task_infinityStart')
	},
	task_filtersChange({ commit, dispatch }, payload){
		commit("task_filtersSet", payload)
		dispatch('task_infinityStart')
	},
	task_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) return
		commit('task_lastOffsetSet', state.offset.current)
		commit('task_loadingBottomSet', true)
		api.tasks
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset.current,
				filters: getters.task_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('task_cacheAppend', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('task_loadingSet', false)
				commit('task_loadingBottomSet', false)
				commit('task_currentOffsetSet')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	task_infinityStart({ commit, dispatch, state, getters }){
		commit('task_lastOffsetSet', 0)
		commit('task_loadingBottomSet', true)
		commit('task_loadingSet', true)
		api.tasks
			.getLimited({
				limit: state.perLoadingLimit,
				offset: 0,
				filters: getters.task_filters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) commit('task_cacheSet', data)
				if (data.error) dispatch('catchErrorNotify', data.error)
				commit('task_loadingBottomSet', false)
				commit('task_loadingSet', false)
				commit('task_currentOffsetSet')
			})
	},
	task_getOne({ commit, dispatch }, payload){
		commit('task_loadingOneSet', true)
		api.tasks
			.getOne(payload)
			.then(({ data }) => {
				commit('task_currentSet', data)
				commit('task_loadingOneSet', false)
			})
	},
	task_getTypes({ commit, dispatch }, payload){
		commit('task_loadingTypesSet', true)
		api.tasks
			.getAllTypes(payload)
			.then(({ data }) => {
				commit('task_cachedTypesSet', data)
				commit('task_loadingTypesSet', false)
			})
	},
}

const mutations = {
	task_cacheSet: (state, payload) => state.cached.list = payload,
	task_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	task_filtersSet: (store, payload) => store.filters = payload,
	task_sortSet: (store, payload) => store.sort = payload,
	task_lastOffsetSet: (store, payload) => store.offset.last = payload,
	task_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	task_currentSet: (store, payload) => store.cached.current = payload,
	task_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	task_cachedTypesSet: (store, payload) => store.cached.models = payload,
	task_loadingSet: (store, payload) => store.loading.list = payload,
	task_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	task_loadingOneSet: (store, payload) => store.loading.one = payload,
	task_loadingTypesSet: (store, payload) => store.loading.models = payload,
	task_edit_currentSet: (store, payload) => store.edit.current = payload,
	task_edit_visibleSet: (store, payload) => store.edit.visible = payload,
}

const getters = {
	task_filters: ({ filters }) => filters,
	task_current: ({ cached }) => cached.current,
	task_cached: ({ cached }) => cached.list,
	task_types: ({ cached }) => cached.types,
	task_loading: ({ loading }) => loading.list,
	task_loadingBottom: ({ loading }) => loading.bottom,
	task_loadingOne: ({ loading }) => loading.one,
	task_loadingTypes: ({ loading }) => loading.types,
	task_edit_visible: ({ edit }) => edit.visible,
	task_edit_current: ({ edit }) => edit.current,
}

export default {
	state,
	actions,
	mutations,
	getters
}
