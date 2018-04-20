import BaseModel from '@/lib/BaseModel'
import InfiniteTableColumn from './InfiniteTableColumn'

export default class InfiniteTableRow extends BaseModel {
	constructor (source, column = null) {
		super(source)

		this._column = null
		this.column = column
	}

	get column () {
		return this._column
	}

	set column (val) {
		this._column = val instanceof InfiniteTableColumn ? val : new InfiniteTableColumn (val)
	}
}
