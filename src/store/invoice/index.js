import api from '@/api'
import reduceInvoice from '@/lib/reducers/invoice'
import reduceMovement from '@/lib/reducers/movement'
import Infinite from '@/lib/Infinite'
import TwoSideInfinite from '@/lib/Infinite/TwoSideInfinite'
import { Invoice } from '@/lib'
import Vue from 'vue'
import merge from 'lodash.merge'

let infinite = new TwoSideInfinite({ method: api.invoices.getLimited, namespace: 'invoice', returns: Invoice })

const namesOf1cFles = {
	blank: 'zagolovki',
	products: 'tovar',
	shipments: 'dostavka',
	payments: 'oplati'
}

const state = merge(infinite.getState(), {
	cached: {
		current: {},
	},
	loading: {
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
})

const actions = merge(infinite.getActions(true), {
	async invoice_init ({ commit, dispatch, getters, state }, payload) {
		if (typeof payload != 'object')
			return dispatch('invoice_getOne', payload)

		dispatch('invoice_defaultSalonSet')
		dispatch('invoice_initInfinite')
		state.infinite.additional = {
			type: getters.invoice_type,
			page: payload.page ?
					[payload.page, payload = undefined][0]
				:	getters.invoice_page
		}
		dispatch('salon_getList', getters.currentUserSalon)
		await state.infinite.start(api.scrollPosition.current.offset)
	},
	invoice_destroy ({ commit, dispatch }) {
		commit('invoice_destroy')
		commit('invoice_infiniteDestroy')
	},
	invoice_defaultSalonSet({ commit, state, getters }) {
		if (state.infinite) return

		let ID_SALONA = state.filters['storage.ID_SALONA'] !== undefined ?
									state.filters['storage.ID_SALONA']
								:	getters.auth_currentSalon.ID_SALONA + ""


		commit('invoice_filtersSet', {
			type: 'inWork',
			...state.filters,
			'storage.ID_SALONA' : ID_SALONA,
		})
	},
	async invoice_sortChange({ commit, dispatch, state, getters }, payload){
		commit("invoice_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async invoice_filtersChange({ commit, dispatch, state, getters }, payload){
		commit("invoice_filtersSet", payload)
		state.infinite.filters = { ...payload, type: undefined, page: undefined }
		state.infinite.additional = { type: getters.invoice_type, page: getters.invoice_page }
		await state.infinite.start()
	},
	async invoice_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
	},
	async invoice_getOne({ commit, dispatch }, payload){
		commit('invoice_loadingOneSet', true)
		let res = await api.invoices.getOne(payload)
		commit('invoice_loadingOneSet', false)
		if (res.data && res.data.error) return
		commit('invoice_currentSet', res.data)
	},
	invoice_print({ commit, dispatch }, { data, type }) {
		let options = type == 'movements' ?
			{ template: 'deliveryNote', data: reduceMovement(data) }
		:	{ template: 'invoice', data: reduceInvoice(data) }

		dispatch('print_run', options)
	},
	invoice_printOpt({ commit, dispatch, getters }, { data, type }) {
		let options = type == 'movements' ?
			{ template: 'deliveryNote', data: reduceMovement(data) }
		:	{ template: 'invoiceOpt', data }

		console.log(options);

		dispatch('print_run', options)
	},
	async invoice_new_init ({ commit, dispatch }) {
		await Promise.all([
			dispatch('invoice_new_getAdSources'),
			dispatch('salon_getList')
		])
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

		commit('cart_cachedListSet', { exist: [], new: [] })
		router.push(`/docs/invoices/${res.data.invoice.ID}`)
	},
	async invoice_addFromCart ({ commit, dispatch, state }) {
		let res = await api.invoices.addFromCart(state.cached.current.ID)
		if (!res.data || res.data.error) return

		commit('cart_removeItemsFromCache', { type: 'exist', data: res.data.exist })
		commit('cart_removeItemsFromCache', { type: 'new', data: res.data.new })
		commit('invoice_currentTdAppend', res.data.exist)
		commit('invoice_currentZakAppend', res.data.new)

		dispatch('notify', 'Предметы успешно добавлены из корзины в заказ')
	},
	async invoice_remove ({ commit, dispatch }, id) {
		commit('invoice_loadingOneSet', true)
		let res = await api.invoices.remove(id)
		commit('invoice_loadingOneSet', false)

		if (!res.data || res.data.error) return
		if (!res.data.id)
			return dispatch('alert', 'Заказ не удалён! Что-то пошло не так...')

		dispatch('notify', 'Заказ успешно удалён')
		router.push('/')
	},
	async invoice_removeTd ({ commit, dispatch, state }, payload) {
		let res = await api.invoices.removeItem({
			id: payload.id,
			type: 'td'
		})
		if (!res.data || res.data.error) return
		commit('invoice_currentTdRemove', res.data)
		dispatch('notify', 'Успешно удалено')
	},
	async invoice_removeZak ({ commit, dispatch, state }, payload) {
		let res = await api.invoices.removeItem({
			id: payload.id,
			type: 'zak'
		})
		if (!res.data || res.data.error) return
		commit('invoice_currentZakRemove', res.data)
		dispatch('notify', 'Успешно удалено')
	},
	async invoice_editZak ({ commit, dispatch }, payload) {
		router.push('/furniture/edit')
		dispatch('furniture_new_setEdit', payload)
	},
	async invoice_exportToAx ({ commit, dispatch }, payload) {
		let res = await api.invoices.exportToAx(payload)
		if (!res.data || res.data.error) return

		commit('invoice_exportToAX')
		dispatch('notify', 'Заказ успешно выгружен в AX')
	},
	async invoice_exportTo1c ({ commit, dispatch }, payload) {
		let res = await api.invoices.exportTo1c(payload)
		if (!res.data || res.data.error) return

		for (var prop in res.data)
			if (res.data.hasOwnProperty(prop))
				dispatch('invoice_download1cFile', { content: res.data[prop], name: namesOf1cFles[prop] })

	},
	invoice_download1cFile ({ commit, dispatch }, { content, name }) {
		let el = document.createElement('a')

		let normalize = content => content.split('\\n').join('\n').split('\\r').join('\r')

		el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( normalize(content) ))
		el.setAttribute('download', `${name}.txt`)
	    el.style.display = 'none'

	    document.body.appendChild(el)
	    el.click()
	    document.body.removeChild(el)
	},
	async invoice_addPayment ({ commit, dispatch }, payload) {
		let res = await api.invoices.addPayment(payload)
		if (!res.data || res.data.error) return

		commit('invoice_currentPaymentAppend', [res.data])
		dispatch('notify', 'Оплата успешно добавлена.')
	},
	async invoice_removePayment ({ commit, dispatch }, payload) {
		let res = await api.invoices.removePayment(payload)
		if (!res.data || res.data.error) return

		commit('invoice_currentPaymentRemove', res.data)
		dispatch('notify', 'Оплата успешно удалена.')
	},
	async invoice_ship ({ commit, dispatch }, id) {
		let res = await api.invoices.ship(id)
		if (!res || !res.ID) return

		commit('invoice_currentUpdate', res)
		commit('invoice_currentSetDax', true)
		dispatch('notify', 'Успешно выгружено и отгружено.', { root: true })
	}
})

const mutations = merge(infinite.getMutations(true), {
	invoice_exportToAX: state => state.cached.current.setAxState(true),
	invoice_destroy: state => state.cached.list = [],
	invoice_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	invoice_filtersSet: (state, payload) => state.filters = payload,
	invoice_sortSet: (state, payload) => state.sort = payload,
	invoice_lastOffsetSet: (state, payload) => state.offset.last = payload,
	invoice_removeOneFromCached: (state, payload) => state.cached.list = state.cached.list.filter(el => el.id != payload.id || payload),
	invoice_currentSet: (state, payload) => state.cached.current = payload instanceof Invoice ? payload : new Invoice (payload),
	invoice_currentUpdate: (state, payload) => state.cached.current.update(payload),
	invoice_currentSetDax: (state, payload) => state.cached.current.setAxState(payload),
	invoice_currentOffsetSet: (state, payload) => state.offset.current = payload !== undefined ? payload : state.cached.list.length,
	invoice_currentTdUpdate: (state, payload) => api.core.assignItems(state.cached.current.td, payload, 'ID'),
	invoice_currentZakUpdate: (state, payload) => api.core.assignItems(state.cached.current.zak, payload, 'ID'),
	invoice_currentTdRemove: (state, payload) =>
		state.cached.current.td = state.cached.current.td.filter(
			el => Array.isArray(payload) ?
				!payload.map(p => p.ID || p).includes(el.ID)
			:	el.ID != payload.ID
		),
	invoice_currentZakRemove: (state, payload) =>
		state.cached.current.zak = state.cached.current.zak.filter(
			el => Array.isArray(payload) ?
				!payload.map(p => p.ID || p).includes(el.ID)
			:	el.ID != payload.ID
		),
	invoice_currentRemoveShipment: (state, payload) =>
		state.cached.current.shipments = state.cached.current.shipments.filter(
			el => el.ID_OTG != (payload.ID_OTG || payload)
		),
	invoice_currentTdAppend: (state, payload) => state.cached.current.td = [...state.cached.current.td, ...payload],
	invoice_currentZakAppend: (state, payload) => state.cached.current.zak = [...state.cached.current.zak, ...payload],
	invoice_currentShipmentsUpdate: (state, payload) => api.core.assignItems(state.cached.current.shipments, payload, 'ID_OTG'),
	invoice_currentShipmensAppend: (state, payload) => state.cached.current.shipments = [...state.cached.current.shipments, payload],
	invoice_currentPaymentAppend: (state, payload) => state.cached.current.payments = [...state.cached.current.payments, ...payload],
	invoice_currentPaymentRemove: (state, payload) => state.cached.current.payments = state.cached.current.payments.filter(el => el.ID_PL != payload.ID_PL),
	invoice_loadingBottomSet: (state, payload) => state.loading.bottom = payload,
	invoice_loadingOneSet: (state, payload) => state.loading.one = payload,

	invoice_new_selectedSet: (state, payload) => state.new.selected = payload,
	invoice_new_loadingSet: (state, payload) => state.new.loading[payload.type] = payload.data,
	invoice_new_cachedSet: (state, payload) => state.new.cached[payload.type] = payload.data,
})

const getters = merge(infinite.getGetters(true), {
	invoice_filters: state => ({ ...state.filters, type: undefined, page: undefined }),
	invoice_type: state => state.filters.type || '',
	invoice_page: state => state.filters.page,
	invoice_current: state => state.cached.current,
	invoice_complete: state => state.complete,
	invoice_cached: state => state.cached.list,
	invoice_loading: state => state.loading.list,
	invoice_loadingBottom: state => state.loading.bottom,
	invoice_loadingOne: state => state.loading.one,

	invoice_new_invoiceSource: state => state.new.invoiceSource,
	invoice_new_selected: state => state.new.selected,
	invoice_new_cached: state => state.new.cached,
	invoice_new_loading: state => state.new.loading,
	invoice_new_adSources: state => state.new.cached.adSources.map(el => ({ label: el.NAME , value: el.ID }))
})

const modules = {

}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
