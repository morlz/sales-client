import api from '@/api'

const state = {
	cached: {
		exist: [],
		'new': []
	},
	loading: {
		list: false
	}
}

const actions = {
	cart_init({ dispatch }){
		dispatch('cart_getAll')
	},
	cart_getAll({ commit, dispatch }){
		commit('cart_loadingListSet', true)
		api.cart
			.getAll()
			.then(res => {
				if (res.data.error) return

				commit('cart_cachedListSet', res.data)
				commit('cart_loadingListSet', false)
			})
	},
	cart_addItem () {

	},
	cart_removeItem ({ commit, dispatch }, payload) {
		api.cart.remove(payload)
			.then(res => {
				if (res.data.error) return
				commit('cart_removeItemFromCache', { type: payload.type, ID: res.data.ID })
			})
	}
}

const mutations = {
	cart_cachedListSet: (state, payload) => [state.cached.exist = payload.exist || [], state.cached.new = payload.new || []],
	cart_loadingListSet: (state, payload) => state.loading.list = payload,
	cart_removeItemFromCache: (state, payload) => state.cached[payload.type] = state.cached[payload.type].filter(el => el.ID != payload.ID)
}

const getters = {
	cart_exist: state => state.cached.exist,
	cart_new: state => state.cached.new,
	cart_cachedCount: state => state.cached.exist.length + state.cached.new.length || 0,
	cart_cachedSumm: state =>
		(state.cached.exist.reduce((prev, el) => prev + +el.td.CENA_ZAL, 0) +
		state.cached.new.reduce((prev, el) => prev + +el.zak.CENA, 0)
		+ "").split("").reduce((prev, el, index) => index % 3 ? prev + el : prev + el + " ", ""),
	cart_loadingList: state => state.loading.list,
}

export default {
	state,
	actions,
	mutations,
	getters
}
