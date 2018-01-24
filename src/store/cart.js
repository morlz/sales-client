import api from '@/api'

const state = {
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
	cart_init({ dispatch }){
		dispatch('cart_getAll')
	},
	async cart_getAll({ commit, dispatch }){
		commit('cart_loadingListSet', true)
		let res = await api.cart.getAll()
		if (res.data.error) return

		commit('cart_cachedListSet', res.data)
		commit('cart_loadingListSet', false)
	},
	async cart_addItem ({ commit, dispatch }, payload) {
		let res = await api.cart.add(payload)
		if (res && res.data && res.data.error) return
		if (res.data.type) {
			commit('cart_cachedListAppend', { [res.data.type] : [res.data] })
			dispatch('notify', { title: "Успешно", message: "Добавлено в корзину" })
			return res
		}
	},
	async cart_removeItem ({ commit, dispatch }, payload) {
		commit('cart_itemRemovingAdd', payload.id)
		let res = await api.cart.remove(payload)
		commit('cart_itemRemovingRemove', payload.id)
		if (res.data && res.data.error) return

		commit('cart_removeItemFromCache', { type: payload.type, ID: res.data.ID })
	}
}

const mutations = {
	cart_cachedListSet: (state, payload) => [state.cached.exist = payload.exist || [], state.cached.new = payload.new || []],
	cart_cachedListAppend: (state, payload) => [
		payload.exist ? state.cached.exist = [...state.cached.exist, ...payload.exist] : null,
		payload.new ? state.cached.new = [...state.cached.new, ...payload.new] : null
	],
	cart_loadingListSet: (state, payload) => state.loading.list = payload,
	cart_removeItemFromCache: (state, payload) => state.cached[payload.type] = state.cached[payload.type].filter(el => el.ID != payload.ID),
	cart_itemRemovingAdd: (state, payload) => !state.loading.remove.includes(payload) ? state.loading.remove.push(payload) : null,
	cart_itemRemovingRemove: (state, payload) => state.loading.remove = state.loading.remove.filter(el => el != payload)
}

const getters = {
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
