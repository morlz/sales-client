import BaseModel from '@/lib/BaseModel'

const getNextValue = (prev, el) => prev[el] === undefined || prev[el] === null ? '' : prev[el]


export default class InfiniteTableColumn extends BaseModel {
	constructor (source) {
		super(source)
	}

	get path () {
		return this.field.split('.')
	}

	getValue (row) {
		if (!this.path) return

		let res = this.path.reduce(getNextValue, row)

		return this.format && typeof this.format.get === 'function' ?
			this.format.get(res, row)
		:	res
	}

	get style () {
		return {
			width: `${this.width}px`
		}
	}
}
