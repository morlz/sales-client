import api from '@/api'
import Infinite from '@/lib/Infinite'

const state = {
	complete: false,
	infinite: false,
	filters: [],
	sort: [],
	cached: {
		list: [],
		current: {},
		currentRolesSetup: [],
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

		if (!res.data || res.data.error) return
		dispatch("notify", { title: "Успешно", message: "Роли сохранены" })
	},
	async personal_init ({ commit, dispatch }, payload) {
		if (payload) {
			dispatch('personal_getOne', payload)
			dispatch('permissions_getRoles')
		} else {
			commit('personal_initInfinite', new Infinite({
				method: api.personals.getLimited
			}))

			state.infinite.on('cached', n => commit('personal_cacheSet', n))
			state.infinite.on('complete', n => commit('personal_completeSet', n))

			await state.infinite.start()
		}
	},
	async personal_sortChange({ commit, dispatch, state }, payload){
		commit("personal_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async personal_filtersChange({ commit, dispatch, state }, payload){
		commit("personal_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async personal_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
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
	personal_destroy: state => state.cached.list = [],
	personal_initInfinite: (state, payload) => state.infinite = payload,
	personal_completeSet: (state, payload) => state.complete = payload,
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
	personal_complete: state => state.complete,
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
