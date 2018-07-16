import api from '@/api'
import Preremoved from '@/lib/Preremoved'

let preremovers = {
	'exist': new Preremoved({
		namespace: 'cart_exist',
		cache: {
			get: state => state.cached.exist,
			set: (state, payload) => state.cached.exist = payload,
		}
	}),
	'new': new Preremoved({
		namespace: 'cart_new',
		cache: {
			get: state => state.cached.new,
			set: (state, payload) => state.cached.new = payload,
		}
	})
}

const state = {
	...Object.values(preremovers)
		.map(el => el.getState(true))
		.reduce((prev, el) => ({ ...prev, ...el }), {}),
	cached: {
		exist: [],
		'new': []
	},
	loading: {
		list: false,
		remove: []
	}
}

const actions = {
	...Object.values(preremovers)
		.map(el => el.getActions(true))
		.reduce((prev, el) => ({ ...prev, ...el }), {}),
	async cart_init({ dispatch }){
		await dispatch('cart_getAll')
	},
	async cart_getAll({ commit, dispatch }){
		commit('cart_loadingListSet', true)
		let res = await api.cart.getAll()
		if (!res.data || res.data.error) return

		commit('cart_cachedListSet', res.data)
		commit('cart_loadingListSet', false)
	},
	async cart_addItem ({ commit, dispatch }, payload) {
		let res = await api.cart.add(payload)
		if (!res.data || res.data.error) return
		if (res.data.type) {
			commit('cart_cachedListAppend', { [res.data.type] : [res.data] })
			dispatch('notify', { title: "Успешно", message: "Добавлено в корзину" })
			return res
		}
	},
	async cart_removeItem ({ commit, dispatch }, payload) {
		const findItem = el => el.ID == payload.id

		commit(`cart_${payload.type}_preremove`, findItem)

		commit('cart_itemRemovingAdd', payload.id)
		let res = await api.cart.remove(payload)
		commit('cart_itemRemovingRemove', payload.id)

		if (!res.data || res.data.error)
			return commit(`cart_${payload.type}_preremoveRestore`, findItem)

		commit(`cart_${payload.type}_preremoveRemove`, findItem)

		//commit('cart_removeItemFromCache', { type: payload.type, ID: res.data.ID })
	}
}

const mutations = {
	...Object.values(preremovers)
		.map(el => el.getMutations(true))
		.reduce((prev, el) => ({ ...prev, ...el }), {}),
	cart_cachedListSet: (state, payload) => [state.cached.exist = payload.exist || [], state.cached.new = payload.new || []],
	cart_cachedListAppend: (state, payload) => [
		payload.exist ? state.cached.exist = [...state.cached.exist, ...payload.exist] : null,
		payload.new ? state.cached.new = [...state.cached.new, ...payload.new] : null
	],
	cart_loadingListSet: (state, payload) => state.loading.list = payload,
	cart_removeItemFromCache: (state, payload) => state.cached[payload.type] = state.cached[payload.type].filter(el => el.ID != payload.ID),
	cart_removeItemsFromCache: (state, payload) => state.cached[payload.type] = state.cached[payload.type].filter(el => !(payload.data.find(f => f.ID == el.UN || f.ID == el.id_zak) + 1)),
	cart_itemRemovingAdd: (state, payload) =>
		!state.loading.remove.includes(payload) ?
			state.loading.remove.push(payload)
		:	null,
	cart_itemRemovingRemove: (state, payload) => state.loading.remove = state.loading.remove.filter(el => el != payload)
}

const getters = {
	...Object.values(preremovers)
		.map(el => el.getGetters(true))
		.reduce((prev, el) => ({ ...prev, ...el }), {}),
	cart_exist: state => state.cached.exist,
	cart_new: state => state.cached.new,
	cart_cachedCount: state => state.cached.exist.length + state.cached.new.length || 0,
	cart_cachedSumm: state =>
		(state.cached.exist.reduce((prev, el) => prev + +el.td.CENA_ZAL, 0) +
		state.cached.new.reduce((prev, el) => prev + +el.zak.CENA, 0)
		+ "").split("").reverse().reduce((prev, el, index) => index % 3 != 0? prev + el : prev + " " + el, "").split("").reverse().join(""),
	cart_loadingList: state => state.loading.list,
	cart_removing: state => state.loading.remove
}

export default {
	state,
	actions,
	mutations,
	getters
}
