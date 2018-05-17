import api from '@/api'
import Infinite from '@/lib/Infinite'
import TwoSideInfinite from '@/lib/Infinite/TwoSideInfinite'
import merge from 'lodash.merge'
import { Shipment } from '@/lib'

let infinite = new TwoSideInfinite({ method: api.shipments.getLimited, namespace: 'shipment', returns: Shipment })



const state = merge(infinite.getState(), {
	cached: {
		current: {},
	},
	loading: {
		one: true,
		bottom: false
	}
})

const actions = merge(infinite.getActions(true), {
	async shipment_init ({ commit, dispatch, getters, state }, payload) {
		if (payload)
			return await dispatch('shipment_getOne', payload)

		dispatch('shipment_defaultSalonSet')
		dispatch('shipment_initInfinite')
		dispatch('salon_getList', getters.currentUserSalon)
		await state.infinite.start(api.scrollPosition.current.offset)
	},
	shipment_defaultSalonSet({ commit, dispatch, state, getters }) {
		if (state.infinite) return
		let ID_SALONA = state.filters['salon.ID_SALONA'] !== undefined ?
									state.filters['salon.ID_SALONA']
								:	getters.auth_currentSalon.ID_SALONA + ""

		commit('shipment_filtersSet', {
			...state.filters,
			'salon.ID_SALONA' : ID_SALONA
		 })
	},
	async shipment_sortChange({ commit, dispatch }, payload){
		commit("shipment_sortSet", payload)
		state.infinite.sort = payload
		await state.infinite.start()
	},
	async shipment_filtersChange({ commit, dispatch }, payload){
		commit("shipment_filtersSet", payload)
		state.infinite.filters = { ...payload }
		await state.infinite.start()
	},
	async shipment_infinity({ commit, dispatch, state, getters }, payload){
		await state.infinite.more(payload)
	},
	async shipment_getOne({ commit, dispatch }, payload){
		commit('shipment_loadingOneSet', true)
		let res = await api.shipments.getOne(payload)
		commit('shipment_loadingOneSet', false)
		if (res.data && res.data.error) return
		commit('shipment_currentSet', res.data)
	},
	async shipment_create ({ commit, dispatch }, payload) {
		let res = await api.shipments.create(payload)
		if (!res.data || res.data.error) return
		if (res.data.errors)
			return dispatch('handleFormErrors', res.data.errors)

		if (!res.data.ID_OTG)
		 	return dispatch('alert', 'Доставка не создана!')

		commit('invoice_currentShipmensAppend', res.data)
		dispatch('notify', 'Доставка успешно создана!')
	},
	async shipment_remove ({ commit, dispatch }, payload) {
		let res = await api.shipments.remove(payload)
		if (!res.data || res.data.error) return

		if (!res.data.shipment)
			return dispatch('alert', 'Ошибка! Доставка не удалена.')

		commit('invoice_currentTdUpdate', res.data.td)
		commit('invoice_currentZakUpdate', res.data.zak)
		commit('invoice_currentRemoveShipment', res.data.shipment)
		dispatch('notify', 'Доставка успешно удалена.')
	},
	async shipment_addRows ({ commit, dispatch }, payload) {
		let res = await api.shipments.addRows(payload)
		if (!res.data || res.data.error) return

		commit('invoice_currentTdUpdate', res.data.td)
		commit('invoice_currentZakUpdate', res.data.zak)
		dispatch('notify', 'Строки успешно доавлены в доставку.')
	},
	async shipment_removeRow ({ commit, dispatch }, payload) {
		let res = await api.shipments.removeRow(payload)
		if (!res.data || res.data.error) return

		commit('invoice_currentTdUpdate', res.data.td)
		commit('invoice_currentZakUpdate', res.data.zak)
		dispatch('notify', 'Строка успешно удалена из доставки')
	},
	async shipment_update ({ commit, dispatch }, payload) {
		let res = await api.shipments.update(payload)
		if (!res.data || res.data.error) return

		commit('invoice_currentShipmentsUpdate', [res.data])
		dispatch('notify', 'Доставка успешно изменена')
	}
})

const mutations = merge(infinite.getMutations(true), {
	shipment_destroy: state => state.cached.list = [],
	shipment_cacheAppend: (state, payload) => state.cached.list = [...state.cached.list, ...payload],
	shipment_filtersSet: (store, payload) => store.filters = payload,
	shipment_sortSet: (store, payload) => store.sort = payload,
	shipment_lastOffsetSet: (store, payload) => store.offset.last = payload,
	shipment_removeOneFromCached: (store, payload) => store.cached.list = store.cached.list.filter(el => el.id != payload.id || payload),
	shipment_currentSet: (store, payload) => store.cached.current = payload,
	shipment_currentOffsetSet: (store, payload) => store.offset.current = payload !== undefined ? payload : store.cached.list.length,
	shipment_loadingBottomSet: (store, payload) => store.loading.bottom = payload,
	shipment_loadingOneSet: (store, payload) => store.loading.one = payload,
	shipment_initInfinite: (state, payload) => state.infinite = payload,
})

const getters = merge(infinite.getGetters(true), {
	shipment_filters: state => state.filters,
	shipment_current: state => state.cached.current,
	shipment_cached: state => state.cached.list,
	shipment_loading: state => state.loading.list,
	shipment_loadingBottom: state => state.loading.bottom,
	shipment_loadingOne: state => state.loading.one,
	shipment_complete: state => state.complete
})

export default {
	state,
	actions,
	mutations,
	getters
}
