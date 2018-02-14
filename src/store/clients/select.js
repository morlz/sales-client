import api from '@/api'
import phoneFormat from '@/lib/phoneFormat'


const state = {
	phone: "",
	new: {
		email: "",
		fio: "",
		gender: false,
		disableSMS: false,
		disableEMAIL: false,
		clientDescription: ""
	},
	exist: {},
	current: 'exist',
	perLoadingLimit: 30,
	cached: {
		list: [],
	},
	loading: {
		list: false,
	},
}

const actions = {
	async client_select_searchByPhone({ commit, dispatch }, payload){
		payload = payload.replace(/\D/g, ``)
		commit('client_select_phoneSet', payload)
		commit('client_select_existSet', {})
		if (!payload)
			return commit("client_select_cacheSet", [])

		commit("client_loadingByPhoneSet", true)
		let res = await api.clients.searchByPhone(payload)
		commit("client_loadingByPhoneSet", false)
		if (res.data && res.data.error) return
		commit("client_select_cacheSet", res.data)
	},
	client_select_backToSearch({ commit }) {
		commit('client_select_typeSet', 'exist')
		commit('client_select_existSet', {})
	}
}

const mutations = {
	client_select_phoneSet: (state, payload) => state.phone = payload,
	client_select_cacheSet: (state, payload) => state.cached.list = payload,
	client_select_newSet: (state, payload) => state.new = payload,
	client_select_newUpdate: (state, payload) => state.new[payload.type] = payload.data,
	client_select_existSet: (state, payload) => state.exist = payload,
	client_select_typeSet: (state, payload) => state.current = payload,
}

const getters = {
	client_select_current: state => state[state.current],
	client_select_type: state => state.current,
	client_select: state => state[state.current],
	client_select_cached: state => state.cached,
	client_select_loading: state => state.loading,
	client_select_phone: state => phoneFormat(state.phone),
	client_select_valid: state => !!state.new.fio && state.new.fio.split(' ').filter(el => el).length > 1 || !!state.exist.id,
	client_select_selected: state => !!(state[state.current].fio || state[state.current].id) && state.phone,
	client_select_currentState: (state, getters) => {
		return {
			search: true,
			list: !getters.client_select_selected && state.current == 'exist',
			exist: getters.client_select_selected && state.current == 'exist',
			new: state.current == 'new',
			buttons: {
				create: state.phone && state.current == 'exist',
				backToSearch: state.current == 'new' || getters.client_select_selected && state.current == 'exist'
			}
		}
	}
}

export default {
	state,
	actions,
	mutations,
	getters
}
