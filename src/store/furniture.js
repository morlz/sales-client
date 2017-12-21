import api from '@/api'

const state = {
	cached: [],
	filters: [],
	sort: [],
	current: {},
	loading: true,
	loadingBottom: false,
	oneLoading: true,
	perLoadingLimit: 30,
	offset: 0,
	lastOffset: -1,
	addFormVisible: false,
	editFormVisible: false,
	models: [],
	modelsLoading: true
}

const actions = {
	furnituresSortChanged({ commit, dispatch }, payload){
		dispatch('furnituresCacheClear')
		commit('changeFurnituresLastOffset', -1)
		commit("furnituresSortChange", payload)
	},
	furnituresFiltersChange({ commit, dispatch }, payload){
		dispatch('furnituresCacheClear')
		commit('changeFurnituresLastOffset', -1)
		commit("furnituresFiltersChange", payload)
	},
	furnituresCacheClear({ commit, dispatch }){
		commit("clearCachedFurnitures")
		commit('setCurrentOffsetFurnitures')
		commit('loadingFurnituresSet', true)
	},
	getAllFurnitures({ commit, dispatch }, ids){
		api.furnitures
			.getAll(ids)
			.then(({ data }) => {
				commit('updateCachedFurnitures', data)
				commit('loadingFurnituresSet', false)
			})
	},
	furnituresInfinity({ commit, dispatch, state, getters }, payload){
		if (state.lastOffset == state.offset) return
		commit('changeFurnituresLastOffset', state.offset)
		commit('loadingBottomFurnituresSet', true)
		api.furnitures
			.getLimited({
				limit: state.perLoadingLimit,
				offset: state.offset,
				filters: getters.furnitureFIlters,
				sort: state.sort
			})
			.then(({ data }) => {
				if (!data.error) {
					commit('updateCachedFurnitures', data)
					payload.loaded()
					if (!data.length) payload.complete ()
				}
				commit('loadingFurnituresSet', false)
				commit('loadingBottomFurnituresSet', false)
				commit('setCurrentOffsetFurnitures')
				if (data.error) dispatch('catchErrorNotify', data.error)
			})
	},
	getOneFurniture({ commit, dispatch }, payload){
		commit('oneLoadingFurnitureSet', true)
		api.furnitures
			.getOne(payload)
			.then(({ data }) => {
				commit('setCurrentFurniture', data)
				commit('oneLoadingFurnitureSet', false)
			})
	},
	getFurninuteModels({ commit, dispatch }, payload){
		commit('loadingFurnitureModelsSet', true)
		api.furnitures
			.getModels(payload)
			.then(({ data }) => {
				commit('updateCachedFurnitureModels', data)
				commit('loadingFurnitureModelsSet', false)
			})
	},
}

const mutations = {
	changeFurnituresLastOffset (store, payload) {
		store.lastOffset = payload
	},
	clearCachedFurnitures (store, payload){
		store.cached = []
	},
	furnituresFiltersChange (store, payload) {
		store.filters = payload
	},
	furnituresSortChange (store, payload) {
		store.sort = payload
	},
	filtredRowsChange (store, payload) {
		store.filteredRows = payload
	},
	updateCachedFurnitures(store, payload){
		payload.map(el => {
			let id = el.id || el
			store.cached = store.cached.filter(el2 => el2.id != id)
			store.cached.push(el)
		})
	},
	updateCachedFurniture(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el2 => el2.id != id)
		store.cached.push(payload)
	},
	removeCachedFurnitures(store, payload){
		payload.map(data => {
			let id = data.id || data
			store.cached = store.cached.filter(el => el.id != id)
		})
	},
	removeCachedFurniture(store, payload) {
		let id = payload.id || payload
		store.cached = store.cached.filter(el => el.id != id)
	},
	loadingFurnituresSet(store, payload) {
		store.loading = payload
	},
	loadingBottomFurnituresSet(store, payload) {
		store.loadingBottom = payload
	},
	oneLoadingFurnitureSet(store, payload){
		store.oneLoading = payload
	},
	loadingByPhoneFurnituresSet(store, payload) {
		store.loadingByPhone = payload
	},
	updateSearchByPhoneQuery(store, payload) {
		state.searchByPhoneQuery = payload
	},
	setCurrentFurniture(store, payload) {
		store.current = payload
	},
	setCurrentOffsetFurnitures(store, payload) {
		store.offset = payload || store.cached.length
	},
	updateCachedFurnitureModels: (store, payload) => store.models = payload,
	loadingFurnitureModelsSet: (store, payload) => store.modelsLoading = payload
}

const getters = {
	furnituresCachedIds: ({ cached }) => cached.map(el => el.id),
	currentFurniture: ({ current }) => current,
	cachedFurnitures: ({ cached }) => cached,
	loadingFurnitures: ({ loading }) => loading,
	loadingBottomFurnitures: ({ loadingBottom }) => loadingBottom,
	oneLoadingFurniture: ({ oneLoading }) => oneLoading,
	furnituresByPhone: ({ cachedFurnituresByPhone }) => cachedFurnituresByPhone,
	loadingFurnituresByPhone: ({ loadingByPhone }) => loadingByPhone,
	furnitureFIlters: ({ filters }) => Object.assign({}, filters),
	addFurnitureContactFormVisible: ({ addFormVisible }) => addFormVisible,
	editFurnitureContactFormVisible: ({ editFormVisible }) => editFormVisible,
	futnitureModels: ({ models }) => models,
	loadingFutnitureModels: ({ modelsLoading }) => modelsLoading,
}

export default {
	state,
	actions,
	mutations,
	getters
}
