import rotateMatrix from './rotateMatrix'
import api from '@/api'

export default (array, field, f, direction = false) => {
	let matrix = array.map(el => el[field])

	matrix = rotateMatrix(matrix)
	matrix.sort( api.core.sortFnFactory(f, direction) )
	matrix = rotateMatrix(matrix)

	return array.map((el, i) => {
		el[field] = matrix[i]
		return el
	})
}
