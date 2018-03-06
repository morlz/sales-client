import api from '@/api'


const state = {
	selected: {
		transfer: []
	}
}

const actions = {

}

const mutations = {
	transfer_selectedSet: (state, payload) => state.selected.transfer = payload
}

const getters = {
	transfer_selected: state => state.selected.transfer
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
