import api from '@/api'
import ResumeInvoice from './ResumeInvoice'
import moment from 'moment'
import { uid } from 'quasar'

export default class ResumeSalon {
	constructor (invoices, date = moment()) {
		this.date = date
		this.salon = invoices[0].salon
		this.invoices = invoices || []
		this._months = []
		this.best = false
		this.uid = uid()
	}

	get id () {
		return +this.salon.ID_SALONA
	}

	get name () {
		return this.salon.NAME
	}

	get group () {
		return this.salon.group
	}

	get months () {
		if (this._months.length)
			return this._months

		let res = []
		for (var i = 0; i < this.daysInMonth; i++)
			res.push(
				this.invoices
					.filter(el => el.day == i + 1)
					.reduce((prev, el) => prev + el.price, 0)
			)

		this._months = [...res, res.reduce((prev, el) => prev + el, 0)]

		return this._months
	}

	set months (value) {
		this._months = value
	}

	get daysInMonth () {
		return this.date.daysInMonth()
	}

	get invoices () {
		return this._invoices
	}

	set invoices (val) {
		if (!Array.isArray(val)) return
		this._invoices = val.map(el => el instanceof ResumeInvoice ? val : new ResumeInvoice(el))
	}

	static best (arr, count = 10) {
		if (!Array.isArray(arr))
			return console.warn('First argument is invalid, Array required')

		if (!arr.every(el => el instanceof this))
			return console.warn('First argument need to be array of [ResumeSalon] instances')

		if (!arr.length) return

		let last = arr[0].months.length - 1

		return arr
			.sort( api.core.sortFnFactory( item => item.months[last] ) )
			.slice(0, count)
			.map(el => el.uid)
	}
}
