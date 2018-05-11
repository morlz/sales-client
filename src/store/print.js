import Mustache from 'mustache'
import api from '@/api'

console.log(api);


const state = {
	cached: {
		templates: []
	},
	loading: {
		templates: false
	}
}

const actions = {
	async print_loadTemplate ({ commit, dispatch }, payload) {
		commit('print_loadingSet', { type: 'templates', data: true })
		let res = await api.print.getTemplate(payload)
		commit('print_loadingSet', { type: 'templates', data: false })
		if (res.data && res.data.error) return
		commit('print_cachedAppend', { type: 'templates', data: res.data })
	},
	async print_run ({ commit, dispatch, state }, { template, data, invoice }) {
		if (!template)
			return dispatch('alert', `Invalid template`)

		let tpl = state.cached.templates.find(el => el.name == template)
		if (!tpl) {
			await dispatch('print_loadTemplate', { template, invoice })
			tpl = state.cached.templates.find(el => el.name == template)
		}

		if (!tpl)
			return dispatch('alert', `Шаблон не найден`)

			console.log(data);

		try {
			let rawHtml = Mustache.render(tpl.html, data)
			dispatch('print_createWindow', rawHtml)
		} catch (err) {
			console.log(err);
			dispatch('alert', err)
		}
	},
	print_createWindow ({ commit, dispatch }, payload) {
		let printPage = window.open()
		if (!printPage)
			return dispatch('alert', 'Ошибка при создании окна! Возможно запрещены всплвающие окна!')
		printPage.document.write(payload)
		printPage.document.close()
		printPage.focus()
		printPage.print()
		printPage.close()
	}
}

const mutations = {
	print_loadingSet: (state, payload) => state.loading[payload.type] = payload.data,
	print_cachedAppend: (state, payload) => state.cached[payload.type].push(payload.data),
}

const getters = {
	print: state => state
}

export default {
	state,
	actions,
	mutations,
	getters
}
