import api from '@/api'
import moment from 'moment'

const rotateMatrix = matrix => {
	let tmp = []

	matrix.map((el, index) => {
		el.map((el2, index2) => {
			if (!tmp[index2])
				tmp[index2] = []

			tmp[index2][index] = el2
		})
	})

	return tmp
}

const sortByMask = (array, field, index, direction = false) => {
	let matrix = array.map(el => el[field])
	matrix = rotateMatrix(matrix)
	matrix.sort( api.core.sortFnFactory(item => item[index], !direction) )
	matrix = rotateMatrix(matrix)
	return array.map((el, i) => ({
		...el,
		[field]: matrix[i]
	}))
}

const state = {
	sort: {
		salon: 3,
		month: 10
	}
}

const actions = {

}

const mutations = {

}

const getters = {
	reports_resume_cached: (state, getters) => sortByMask(
		getters.data.sort(
			api.core.sortFnFactory(item => item.months[state.sort.month], true)
		),
		'months',
		state.sort.salon
	),
	data: (state, a, b, rootGetters) => rootGetters.salon_list.map(el => ({
		...el,
		months: Array.apply(null, { length: 30 }).map((el, index) => Math.round(Math.random() * 100))
	}))
}

export default {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
