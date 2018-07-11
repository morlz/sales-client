import api from '@/api'
import Infinite from '@/lib/Infinite'
import TwoSideInfinite from '@/lib/Infinite/TwoSideInfinite'
import merge from 'lodash.merge'
import { Manager } from '@/lib'
import managerGroups from './managerGroups'
import managerSalons from './managerSalons'

let infinite = new TwoSideInfinite({ method: api.personals.getLimited, namespace: 'personal', returns: Manager })

const state = merge(infinite.getState(), {
	cached: {
		current: {},
		currentRolesSetup: [],
	},
	loading: {
		one: true,
		bottom: false,
		currentRolesSetup: true
	},
	edit: {
		active: false
	}
})

const actions = merge(infinite.getActions(true), {
	async personal_saveRoleSetupState ({ commit, dispatch, state }) {
		let res = await api.personals.saveRoleSetupState({
			id: +state.cached.current.ID_M,
			rolesSetup: state.cached.currentRolesSetup
		})

		if (!res.data || res.data.error) return
		dispatch("notify", { title: "Успешно", message: "Роли сохранены" })
	},
	async personal_init ({ commit, dispatch }, payload) {
		if (payload)
			return await dispatch('personal_getOne', payload)

		dispatch('personal_initInfinite')
		await state.infinite.start(api.scrollPosition.current.offset)
	},
	personal_destroy ({ commit, dispatch }) {
		commit('personal_destroy')
		commit('personal_infiniteDestroy')
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
	async personal_getOne({ commit, dispatch }, payload){
		commit('personal_loadingOneSet', true)
		let res = await api.personals.getOne(payload)
		commit('personal_loadingOneSet', false)
		if (!res || res.error) return

		commit('personal_currentSet', res)
	},
	async personal_getRoleSetup ({ commit, dispatch }, payload) {
		commit('personal_loadingRolesSetupSet', true)
		let res  = await api.personals.getOneRolesSetup(payload)
		commit('personal_loadingRolesSetupSet', false)
		if (!res.data || res.data.error) return

		commit('personal_currentRolesSetupSet', res.data)
	},
	async personal_save ({ commit, dispatch }, manager) {
		if (!(manager instanceof Manager)) return

		let res = await manager.save()
		if (!res || res.error) return

		if (res.errors)
			return dispatch('handleFormErrors', res.errors, { root: true })

		dispatch('notify', 'Профль успешно изменён.')
		dispatch('personal_getOne', res.id)
		commit('auth_update', res)

		return true
	}
})

const mutations = merge(infinite.getMutations(true), {
	personal_destroy: state => state.cached.list = [],
	personal_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	personal_filtersSet: (store, payload) => store.filters = payload,
	personal_sortSet: (store, payload) => store.sort = payload,
	personal_lastOffsetSet: (store, payload) => store.offset.last = payload,
	personal_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	personal_currentSet: (store, payload) => store.cached.current = payload,
	personal_currentOffsetSet: (store, payload) => store.offset.current = payload !== undefined ? payload : store.cached.list.length,
	personal_currentRolesSetupSet: (store, payload) => store.cached.currentRolesSetup = payload,
	personal_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	personal_loadingOneSet: (store, payload) => store.loading.one = payload,
	personal_loadingRolesSetupSet: (store, payload) => store.loading.currentRolesSetup = payload,
	personal_editSet: (state, payload) => state.edit.active = payload,
})

const getters = merge(infinite.getGetters(true), {
	personal_complete: state => state.complete,
	personal_filters: ({ filters }) => filters,
	personal_cached: ({ cached }) => cached.list,
	personal_current: ({ cached }) => cached.current,
	personal_currentRoleSetup: ({ cached }) => cached.currentRolesSetup,
	personal_loading: ({ loading }) => loading.list,
	personal_loadingBottom: ({ loading }) => loading.bottom,
	personal_loadingOne: ({ loading }) => loading.one,
	personal_edit: state => state.edit.active
})

const modules = {
	managerGroups,
	managerSalons
}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
