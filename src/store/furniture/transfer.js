import api from '@/api'


const state = {
	selected: {
		transfer: []
	}
}

const actions = {
	async transfer_take ({ commit, dispatch, getters }, { salon, place }) {
		if (!getters.transfer_selectedIDs) return

		let res = await api.furnitures.transferTake({
			ids: getters.transfer_selectedIDs,
			salon,
			place
		})

		if (!res.data || res.data.error) return

		commit('furniture_removeManyFromCache', res.data, { root: true })
		dispatch('notify', `Успешно принято ${res.data.length} шт.`, { root: true })
	}
}

const mutations = {
	transfer_selectedSet: (state, payload) => state.selected.transfer = payload
}

const getters = {
	transfer_selected: state => state.selected.transfer,
	transfer_selectedIDs: state => state.selected.transfer.map(el => el.td.ID),
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
