import api from '@/api'

const state = {
	filters: [],
	sort: [],
	perLoadingLimit: 30,
	cached: {
		list: [],
		current: {},
		currentRolesSetup: [],
	},
	offset: {
		current: 0,
		last: -1
	},
	loading: {
		list: true,
		one: true,
		bottom: false,
		currentRolesSetup: true
	}
}

const actions = {
	async personal_saveRoleSetupState ({ commit, dispatch, state }) {
		let res = await api.personals.saveRoleSetupState({
			id: +state.cached.current.ID_M,
			rolesSetup: state.cached.currentRolesSetup
		})

		if (!res.data || rs.data.error) return
		dispatch("notify", { title: "Успешно", message: "Роли сохранены" })
	},
	async personal_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('personal_getOne', payload)
			dispatch('permissions_getRoles')
		} else {
			await dispatch('personal_infinityStart')
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
	async personal_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current)return
		commit('personal_lastOffsetSet', state.offset.current)
		commit('personal_loadingBottomSet', true)
		let res = await api.personals.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.personal_filters,
			sort: state.sort
		})
		commit('personal_loadingSet', false)
		commit('personal_loadingBottomSet', false)
		if(!res.data || res.data.error) return

		commit('personal_cacheAppend', res.data)
		commit('personal_currentOffsetSet')
		payload.loaded()
		if (!res.data.length)
			payload.complete()
	},
	async personal_infinityStart({ commit, dispatch, state, getters }){
		commit('personal_lastOffsetSet', 0)
		commit('personal_currentOffsetSet', 0)
		commit('personal_loadingBottomSet', true)
		commit('personal_loadingSet', true)
		let res = await api.personals.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.personal_filters,
			sort: state.sort
		})
		commit('personal_loadingBottomSet', false)
		commit('personal_loadingSet', false)

		if (!res.data || res.data.error) return
		commit('personal_cacheSet', res.data)
		commit('personal_currentOffsetSet')
	},
	personal_getOne({ commit, dispatch }, payload){
		commit('personal_loadingOneSet', true)
		api.personals
			.getOne(payload)
			.then(({ data }) => {
				commit('personal_currentSet', data)
				commit('personal_loadingOneSet', false)
			})

		commit('personal_loadingRolesSetupSet', true)
		api.personals
			.getOneRolesSetup(payload)
			.then(({ data }) => {
				commit('personal_currentRolesSetupSet', data)
				commit('personal_loadingRolesSetupSet', false)
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
	personal_currentOffsetSet: (store, payload) => store.offset.current = payload !== undefined ? payload : store.cached.list.length,
	personal_currentRolesSetupSet: (store, payload) => store.cached.currentRolesSetup = payload,
	personal_loadingSet: (store, payload) => store.loading.list = payload,
	personal_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	personal_loadingOneSet: (store, payload) => store.loading.one = payload,
	personal_loadingRolesSetupSet: (store, payload) => store.loading.currentRolesSetup = payload,
}

const getters = {
	personal_filters: ({ filters }) => filters,
	personal_cached: ({ cached }) => cached.list,
	personal_current: ({ cached }) => cached.current,
	personal_currentRoleSetup: ({ cached }) => cached.currentRolesSetup,
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
