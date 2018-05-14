import api from '@/api'


const state = {
	selected: {
		transfer: [],
		move: false
	}
}

const actions = {
	async transfer_take ({ commit, dispatch, getters, rootGetters }, { salon, place }) {
		if (!getters.transfer_selectedIDs) return

		let res = await api.furnitures.transferTake({
			ids: getters.transfer_selectedIDs,
			salon,
			place
		})

		if (!res.data || res.data.error) return

		commit('furniture_removeManyFromCache', res.data, { root: true })
		dispatch('notify', `Успешно принято ${res.data.length} шт.`, { root: true })
		dispatch('furniture_getModels', { filters: rootGetters.furniture_filters, type: 'new' }, { root: true })
	},
	async transfer_moveToSalon ({ commit, dispatch, state }, salon_id) {
		let res = await api.furnitures.moveToSalon({
			id: state.selected.move.td.ID,
			salon_id
		})

		if (!res.data || res.data.error) return

		commit('furniture_removeOneFromCache', state.selected.move, { root: true })
		dispatch('notify', 'Успешно перемещено', { root: true })
	}
}

const mutations = {
	transfer_selectedSet: (state, payload) => state.selected.transfer = payload,
	transfer_selectedToMoveSet: (state, payload) => state.selected.move = payload,
}

const getters = {
	transfer_selected: state => state.selected.transfer,
	transfer_selectedIDs: state => state.selected.transfer,
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
