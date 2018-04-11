import ResumeInvoice from './ResumeInvoice'
import moment from 'moment'

export default class ResumeSalon {
	constructor (invoices, date = moment()) {
		this.date = date
		this.salon = invoices[0].salon
		this.invoices = invoices.map(el => new ResumeInvoice(el))
		this._months = []
	}

	get id () {
		return this.salon.ID_SALONA
	}

	get name () {
		return this.salon.NAME
	}

	get months () {
		if (this._months.length)
			return this._months

		let res = []
		for (var i = 1; i <= this.daysInMonth; i++)
			res.push(
				this.invoices
					.filter(el => el.day == i)
					.reduce((prev, el) => prev + el.price, 0)
			)

		return [...res, res.reduce((prev, el) => prev + el, 0)]
	}

	set months (value) {
		this._months = value
	}

	get daysInMonth () {
		return this.date.daysInMonth()
	}
}
