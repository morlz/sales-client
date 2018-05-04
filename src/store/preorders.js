import api from '@/api'
import Infinite from '@/lib/Infinite'
import Preorder from '@/lib'

const state = {
	complete: false,
	infinite: false,
	filters: {},
	sort: {},
	cached: {
		list: [],
		current: {},
		statuses: []
	},
	loading: {
		list: false,
		one: true,
		statuses: true,
		bottom: false
	},
	add: {}
}

const actions = {
	async preorder_init ({ commit, dispatch, state, getters }, payload) {
		dispatch('preorder_getStatuses')

		if (payload) {
			await dispatch('preorder_getOne', payload)
		} else {
			let ID_SALONA = getters.auth_currentSalon.ID_SALONA + ""

			dispatch('salon_getList')
			commit('preorder_initInfinite', new Infinite({
				method: api.preorders.getLimited,
				filters: {
					'salon.ID_SALONA': ID_SALONA
				}
			}))

			commit('preorder_filtersSet', {
				...state.filters,
				'salon.ID_SALONA': ID_SALONA
			})

			state.infinite.on('cached', n => commit('preorder_cacheSet', n))
			state.infinite.on('complete', n => commit('preorder_completeSet', n))

			await state.infinite.start()
		}
	},
	async preorder_sortChange({ commit, dispatch }, payload){
		commit("preorder_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async preorder_filtersChange({ commit, dispatch }, payload){
		commit("preorder_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async preorder_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
	},
	async preorder_getOne({ commit, dispatch }, payload){
		commit('preorder_loadingOneSet', true)
		let res = await api.preorders.getOne(payload)
		commit('preorder_loadingOneSet', false)
		if (!res.data || res.data.error) return

		commit('preorder_currentSet', res.data)
	},
	async preorder_getStatuses({ commit, dispatch }, payload){
		commit('preorder_loadingStatusesSet', true)
		let res = await api.preorders.getStatuses(payload)
		commit('preorder_loadingStatusesSet', false)
		if (!res.data || res.data.error) return

		commit('preorder_cachedStatusesSet', res.data)
	},
	async preorder_createNew ({ commit, dispatch, getters }) {
		let res = await api.preorders.create({
			main: getters.preorder_add,
			nextTask: getters.task_add_next,
			client: getters.client_select_current,
			clientType: getters.client_select_type
		})
		if (!res.data || res.data.error) return

		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		dispatch('notify', 'Предзаказ успешно создан')
		router.push({ path: `/preorder/preorders/${res.data.preorder.id}` })
	},
	async preorder_update ({ commit, dispatch }, payload) {
		let res = await api.preorders.update(payload)
		if (!res.data || res.data.error) return

		commit('preorder_currentUpdate', res.data)
		dispatch('notify', 'Предзаказ успешно обновлён')
	}
}

const mutations = {
	preorder_destroy: state => state.cached.list = [],
	preorder_initInfinite: (state, payload) => state.infinite = payload,
	preorder_completeSet: (state, payload) => state.complete = payload,
	preorder_cacheSet: (state, payload) => state.cached.list = payload,
	preorder_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	preorder_filtersSet: (state, payload) => state.filters = payload,
	preorder_sortSet: (state, payload) => state.sort = payload,
	preorder_lastOffsetSet: (state, payload) => state.offset.last = payload,
	preorder_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	preorder_currentSet: (state, payload) => state.cached.current = payload instanceof Preorder ? payload : new Preorder(payload),
	preorder_currentUpdate: (state, payload) => state.cached.current.update(payload),
	preorder_currentTaskUpdate: (state, payload) => api.core.assignItem(state.cached.current.tasks, payload),
	preorder_currentContctAdd: (state, payload) => state.cached.current.contactFaces.push(payload),
	preorder_currentClientUpdate: (state, payload) => state.cached.current.client ? state.cached.current.client.update(payload) : 0,
	preorder_currentContctUpdate: (state, payload) => api.core.assignItem(state.cached.current.contactFaces, payload),
	preorder_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	preorder_cachedStatusesSet: (state, payload) => state.cached.statuses = payload,
	preorder_loadingSet: (state, payload) => state.loading.list = payload,
	preorder_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	preorder_loadingOneSet: (state, payload) => state.loading.one = payload,
	preorder_loadingStatusesSet: (state, payload) => state.loading.statuses = payload,
	preorder_add_set: (state, payload) => state.add = payload,
}

const getters = {
	preorder_complete: state => state.complete,
	preorder_filters: ({ filters }) => filters,
	preorder_filtersPhone: state => state.filters['contactFaces.phone'] || "",
	preorder_current: ({ cached }) => cached.current,
	preorder_cached: ({ cached }) => cached.list,
	preorder_statuses: ({ cached }) => cached.statuses,
	preorder_loading: ({ loading }) => loading.list,
	preorder_loadingBottom: ({ loading }) => loading.bottom,
	preorder_loadingOne: ({ loading }) => loading.one,
	preorder_acceptedAdd: state => state.filters && state.filters['contactFaces.phone'] && state.filters['contactFaces.phone'].length > 10 && !state.loading.list,
	preorder_add: state => state.add,
}

export default {
	state,
	actions,
	mutations,
	getters
}
