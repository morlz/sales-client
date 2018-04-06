import api from '@/api'

const state = {
	fileUploadUrl: ""
}

const actions = {
	file_downoad ({ commit, dispatch }, { filename, content }) {
		let blob = new Blob([content], { type: 'text/plain' })

		if ('msSaveBlob' in navigator)
			navigator.msSaveBlob(blob, filename);

		let el = document.createElement('a'),
			url = window.URL.createObjectURL(blob)

		el.setAttribute('href', url)
		el.setAttribute('download', filename)
		el.style.display = 'none'
		document.body.appendChild(el)
		el.click()
		window.URL.revokeObjectURL(url)
		document.body.removeChild(el)

		dispatch('notify', `Начата загрузка файла ${filename}`)
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
