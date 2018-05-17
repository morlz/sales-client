import InfiniteTableRow from './InfiniteTableRow'
import InfiniteTableColumn from './InfiniteTableColumn'

export default class InfiniteTable {
	constructor (columns = [], rows = []) {
		this._rows = []
		this._columns = []

		this.rows = rows
		this.columns = columns
	}

	get rows () {
		return this._rows
	}

	set rows (val) {
		if (!Array.isArray(val)) return

		this._rows = val //.map(el => el instanceof InfiniteTableRow ? el : new InfiniteTableRow(el))
	}

	get columns () {
		return this._columns
	}

	set columns (val) {
		if (!Array.isArray(val))
			return console.warn('[InfiniteTable] [set columns] invalid value, Array required')

		this._columns = val.map(el => el instanceof InfiniteTableColumn ? el : new InfiniteTableColumn(el))
	}
}

export {
	InfiniteTable,
	InfiniteTableRow,
	InfiniteTableColumn
}
