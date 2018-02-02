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
	async invoice_init ({ commit, dispatch, getters }, payload) {
		dispatch('getSalonsList', getters.currentUserSalon)
		if (payload.id) {
			await dispatch('invoice_getOne', payload.id)
		} else {
			await dispatch('invoice_infinityStart')
		}
	},
	async invoice_sortChange({ commit, dispatch }, payload){
		commit("invoice_sortSet", payload)
		await dispatch('invoice_infinityStart')
	},
	async invoice_filtersChange({ commit, dispatch }, payload){
		commit("invoice_filtersSet", payload)
		await dispatch('invoice_infinityStart')
	},
	async invoice_infinity({ commit, dispatch, state, getters }, payload){
		if (state.offset.last == state.offset.current) {
			setTimeout(a => payload.loaded(), 5e2)
			return
		}
		commit('invoice_lastOffsetSet', state.offset.current)
		commit('invoice_loadingBottomSet', true)
		let res = await api.invoices.getLimited({
			limit: state.perLoadingLimit,
			offset: state.offset.current,
			filters: getters.invoice_filters,
			sort: state.sort,
			type: getters.invoice_type,
			page: getters.invoice_page
		})
		commit('invoice_loadingSet', false)
		commit('invoice_loadingBottomSet', false)
		payload.loaded()
		if (res.data && res.data.error) return
		commit('invoice_cacheAppend', res.data)
		commit('invoice_currentOffsetSet')
		if (!res.data.length) payload.complete ()
	},
	async invoice_infinityStart({ commit, dispatch, state, getters }){
		commit('invoice_lastOffsetSet', 0)
		commit('invoice_loadingBottomSet', true)
		commit('invoice_loadingSet', true)
		let res = await api.invoices.getLimited({
			limit: state.perLoadingLimit,
			offset: 0,
			filters: getters.invoice_filters,
			sort: state.sort,
			type: getters.invoice_type,
			page: getters.invoice_page
		})
		commit('invoice_loadingBottomSet', false)
		commit('invoice_loadingSet', false)
		if (res.data && res.data.error) return
		commit('invoice_cacheSet', res.data)
		commit('invoice_currentOffsetSet')
	},
	async invoice_getOne({ commit, dispatch }, payload){
		commit('invoice_loadingOneSet', true)
		let res = await api.invoices.getOne(payload)
		commit('invoice_loadingOneSet', false)
		if (res.data && res.data.error) return
		commit('invoice_currentSet', res.data)
	},
}

const mutations = {
	invoice_cacheSet: (state, payload) => state.cached.list = payload,
	invoice_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	invoice_filtersSet: (store, payload) => store.filters = payload,
	invoice_sortSet: (store, payload) => store.sort = payload,
	invoice_lastOffsetSet: (store, payload) => store.offset.last = payload,
	invoice_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	invoice_currentSet: (store, payload) => store.cached.current = payload,
	invoice_currentOffsetSet: (store, payload) => store.offset.current = payload || store.cached.list.length,
	invoice_loadingSet: (store, payload) => store.loading.list = payload,
	invoice_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	invoice_loadingOneSet: (store, payload) => store.loading.one = payload,
}

const getters = {
	invoice_filters: state => ({ ...state.filters, type: undefined, page: undefined }),
	invoice_type: state => state.filters.type,
	invoice_page: state => state.filters.page,
	invoice_current: ({ cached }) => cached.current,
	invoice_cached: ({ cached }) => cached.list.map(el => {
		let tmp = { ...el }
		if (!el.client)
			tmp.client = el.clientOld

		tmp.client.fio = el.client ?
							`${tmp.client.lastName} ${tmp.client.name} ${tmp.client.patronymic}`
						:	`${tmp.client.FIO} ${tmp.client.IMY} ${tmp.client.OTCH}`

		tmp.manager.fio = `${tmp.manager.FIO} ${tmp.manager.IMY} ${tmp.manager.OTCH}`
		return tmp
	}),
	invoice_loading: ({ loading }) => loading.list,
	invoice_loadingBottom: ({ loading }) => loading.bottom,
	invoice_loadingOne: ({ loading }) => loading.one,
}

export default {
	state,
	actions,
	mutations,
	getters
}
