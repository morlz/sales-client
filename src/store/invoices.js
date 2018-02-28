import api from '@/api'
import reduceInvoice from '@/lib/reducers/invoice'

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
	},
	new: {
		selected: {
			podium: false,
			nonCache: false,
			internet: false,
			adSource: "",
			invoiceSource: "1",
			shipment: {
				date: "",
				address: ""
			}
		},
		cached: {
			adSources: []
		},
		loading: {
			adSources: false,
			create: false
		},
		invoiceSource: [
			{ label: "Сайт", value: "1" },
			{ label: "Звнонок", value: "2" },
			{ label: "Салон", value: "3" },
		]
	}
}

const actions = {
	async invoice_init ({ commit, dispatch, getters, state }, payload) {
		dispatch('salon_getList', getters.currentUserSalon)
		if (payload) {
			await dispatch('invoice_getOne', payload)
		} else {
			commit('invoice_filtersSet', {
				...state.filters,
				'storage.ID_SALONA' : state.filters['storage.ID_SALONA'] !== undefined ?
											state.filters['storage.ID_SALONA']
										:	getters.auth_currentSalon.ID_SALONA + ""
			 })
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
		if (state.offset.last == state.offset.current) return

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
		if (res.data && res.data.error) return
		commit('invoice_cacheAppend', res.data)
		commit('invoice_currentOffsetSet')

		payload.loaded()
		if (!res.data.length)
			payload.complete()
	},
	async invoice_infinityStart({ commit, dispatch, state, getters }){
		commit('invoice_lastOffsetSet', 0)
		commit('invoice_currentOffsetSet', 0)
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
	invoice_print({ commit, dispatch }, payload) {
		payload = reduceInvoice(payload)
		console.log({ ...payload })
		dispatch('print_run', { template: 'invoice', data: payload })
	},
	async invoice_new_init ({ commit, dispatch }) {
		await dispatch('invoice_new_getAdSources')
	},
	async invoice_new_getAdSources ({ commit, dispatch }) {
		commit('invoice_new_loadingSet', { type: 'adSources', data: true })
		let res = await api.invoices.getAdSources()
		commit('invoice_new_loadingSet', { type: 'adSources', data: false })
		if (res.data && res.data.error) return
		commit('invoice_new_cachedSet', { type: 'adSources', data: res.data })
	},
	async invoice_new_create ({ commit, dispatch, state, getters }) {
		commit('invoice_new_loadingSet', { type: 'create', data: true })
		let res = await api.invoices.create({
			...state.new.selected,
			client: getters.client_select_current,
			type: getters.client_select_type
		})
		commit('invoice_new_loadingSet', { type: 'create', data: false })
		if (!res.data || res.data && res.data.error) return
		if (res.data && res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		if (res.data.invoice)
			dispatch('notify', 'Заказ создан')

		console.log(res.data);
	}
}

const mutations = {
	invoice_cacheSet: (state, payload) => state.cached.list = payload,
	invoice_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	invoice_filtersSet: (state, payload) => state.filters = payload,
	invoice_sortSet: (state, payload) => state.sort = payload,
	invoice_lastOffsetSet: (state, payload) => state.offset.last = payload,
	invoice_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	invoice_currentSet: (state, payload) => state.cached.current = payload,
	invoice_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	invoice_loadingSet: (state, payload) => state.loading.list = payload,
	invoice_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	invoice_loadingOneSet: (state, payload) => state.loading.one = payload,

	invoice_new_selectedSet: (state, payload) => state.new.selected = payload,
	invoice_new_loadingSet: (state, payload) => state.new.loading[payload.type] = payload.data,
	invoice_new_cachedSet: (state, payload) => state.new.cached[payload.type] = payload.data,
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

		tmp.manager = tmp.manager ?
				  { ...tmp.manager, fio: tmp.manager.FIO ? `${tmp.manager.FIO} ${tmp.manager.IMY} ${tmp.manager.OTCH}` : '' }
			:	null
		return tmp
	}),
	invoice_loading: ({ loading }) => loading.list,
	invoice_loadingBottom: ({ loading }) => loading.bottom,
	invoice_loadingOne: ({ loading }) => loading.one,

	invoice_new_invoiceSource: state => state.new.invoiceSource,
	invoice_new_selected: state => state.new.selected,
	invoice_new_cached: state => state.new.cached,
	invoice_new_loading: state => state.new.loading,
	invoice_new_adSources: state => state.new.cached.adSources.map(el => ({ label: el.NAME , value: el.ID }))
}

export default {
	state,
	actions,
	mutations,
	getters
}
