import api from '@/api'
import settings from '@/store/main/auth/settings'
import { Manager, Salon } from '@/lib'

const state = {
	user: false,
	currentSalon: false,
	visible: {
		currentSalon: false
	},
	permissions: [],
	salons: [],
	token: "",
	loading: {
		auth: false,
		permissions: false,
		currentSalon: false,
		geolocation: false
	},
	form: {
		login: "",
		password: ""
	}
}

const actions = {
	async auth_init ({ commit, dispatch }) {
		let token = api.auth.getToken()

		commit("auth_updateToken", token ? token : "")
		if (!token) return

		commit("auth_loadingSet", { auth: true })
		let res = await api.auth.getUserData()
		commit("auth_loadingSet", { auth: false })

		if (res.data && res.data.error) {
			if (res.data.error.status == 403)
				commit ('auth_updateToken')
			return
		}

		if (res && res.data && res.data.token) {
			commit("auth_userSet", res.data)
			commit("auth_updateToken", res.data.token)
			await dispatch("auth_getPermissions")
		}
	},
	async auth_signIn ({ commit, dispatch, state }) {
		let res = await api.auth.signIn(btoa(JSON.stringify(state.form)))
		if (!res.data || res.data.error) return
		if (res && res.data && res.data.token) {
			commit("auth_userSet", res.data)
			commit("auth_updateToken", res.data.token)
			await dispatch("auth_getPermissions")
		}
	},
	signUp () {

	},
	async logOut ({ commit, dispatch }) {
		await api.auth.logOut()
		commit("auth_logout", false)
		commit("auth_permissionsSet", [])
		commit("auth_updateToken")
		commit('salon_listEmpty')
	},
	async auth_getPermissions ({ commit, dispatch }) {
		let info = {
			userAgent: window.navigator.userAgent,
			deviceMemory: window.navigator.deviceMemory,
			hardwareConcurrency: window.navigator.hardwareConcurrency,
			downlink: window.navigator.connection.downlink,
			effectiveType: window.navigator.connection.effectiveType,
			gl: {}
		}

		try {
			commit("auth_loadingSet", { geolocation: true })
			let { coords } = await dispatch('auth_getGeolocation')
			commit("auth_loadingSet", { geolocation: false })
			info.gl = {
				accuracy: coords.accuracy,
				altitude: coords.altitude,
				heading: coords.heading,
				latitude: coords.latitude,
				longitude: coords.longitude,
				speed: coords.speed
			}
		} catch (err) {
			console.warn(err)
			dispatch('notify', 'Не удалось получить ваше местоположение, вам нужно выбрать салон вручную.')
		}

		commit("auth_loadingSet", { permissions: true })
		let res = await api.auth.getPermissions(info)
		commit("auth_loadingSet", { permissions: false })
		if (!res.data || res.data.error) return

		commit("auth_permissionsSet", res.data.permissions)

		// обьект в массив
		let salons = []
		for (var prop in res.data.salons)
			if (res.data.salons.hasOwnProperty(prop))
				salons.push(res.data.salons[prop])

		commit("auth_salonsSet", salons)

		//координаты не изменились
		if (res.data.salon)
			return commit('auth_currentSalonSet', res.data.salon)

		//нет доступа к салонам
		if (!salons) return

		//всего 1 салон
		if (salons.length == 1)
			return commit('auth_currentSalonSet', salons[0])

		//выбор салона
		if (salons.length > 1)
			return commit('auth_currentSalonVisibleSet', true)
	},
	auth_getGeolocation() {
		return new Promise((resolve, reject) => window.navigator.geolocation.getCurrentPosition(resolve, reject))
	},
	async auth_currentSalonSet ({ commit, dispatch }, payload) {
		commit("auth_loadingSet", { currentSalon: true })
		let res = await api.auth.setSalon(payload)
		commit("auth_loadingSet", { currentSalon: false })
		if (!res.data || res.data.error) return

		commit('auth_currentSalonSet', res.data)
	}
}

const mutations = {
	auth_userSet: (state, payload) => state.user = payload instanceof Manager ? payload : new Manager(payload),
	auth_updateToken: (state, payload) => {
		state.token = payload
		payload ? api.auth.setToken(payload) : api.auth.unsetToken()
	},
	auth_permissionsSet: (state, payload) => state.permissions = payload || [],
	auth_salonsSet: (state, payload) => state.salons = payload || [],
	auth_formSet: (state, payload) => state.form[payload.type] = payload.data,
	auth_currentSalonSet: (state, payload) => state.currentSalon = payload instanceof Salon ? payload : new Salon(payload),
	auth_currentSalonVisibleSet: (state, payload) => state.visible.currentSalon = payload,
	auth_loadingSet: (state, payload) => state.loading = { ...state.loading, ...payload },
	auth_logout: state => state.user = false
}

const getters = {
	auth_permissins: state => state.permissions,
	auth_form: state => state.form,
	auth_currentSalon: state => state.currentSalon,
	auth_currentSalonVisible: state => state.visible.currentSalon,
	auth_loadingForm: (state, getters) => getters.auchChecking || getters.logined,
	auth_salon: (state, getters, rootState, rootGetters) => rootGetters.salon_list.find(el => el.ID_SALONA == getters.currentUserSalon) || {},
	auth_user: state => state.user,
	logined: state => !!state.user && !!state.permissions && state.permissions.length && !!state.currentSalon,
	loginedAs: state => state.user,
	auchChecking: state => Object.values(state.loading).every(el => el),
	currentUserSalon: state => state.user.ID_SALONA,
}

const modules = {
	settings
}

export default {
	state,
	actions,
	mutations,
	getters,
	modules
}
