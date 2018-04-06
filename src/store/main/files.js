import api from '@/api'

const state = {
	fileUploadUrl: ""
}

const actions = {
	file_downoad ({ commit, dispatch }, { filename, content }) {
		let el = document.createElement('a')

		el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
		el.setAttribute('download', filename)
		el.style.display = 'none'
		document.body.appendChild(el)
		el.click()
		document.body.removeChild(el)
	}
}

const mutations = {

}

const getters = {
	fileUploadUrl ({ fileUploadUrl }) {
		return fileUploadUrl
	}
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
