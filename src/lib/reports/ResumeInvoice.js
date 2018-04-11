import moment from 'moment'

export default class ResumeInvoice {
	constructor (source) {
		this._source = source
	}

	get price () {
		return 	this._source.zak.reduce((prev, el) => prev + +el.price, 0) +
				this._source.td.reduce((prev, el) => prev + +el.price, 0)
	}

	get day () {
		return moment(this._source.DATE).get('date')
	}
}
