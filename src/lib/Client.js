import BaseModel from '@/lib/BaseModel'
import { ContactFace, Invoice } from '@/lib'
import moment from 'moment'

export default class Client extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			cotactfaces: [ContactFace],
			invoices: [Invoice]
		}, arg)
	}

	get fio () {
		return `${this.lastname} ${this.name} ${this.patronymic}`.trim()
	}

	set fio (val) {
		let [lastname, name, patronymic] = val.trim().split(' ')
		this.lastname = lastname || ''
		this.name = name || ''
		this.patronymic = patronymic || ''
	}

	get notactiveDate () {
		if (this._notactive === null)
			return ''

		return moment(this._notactive).format('DD MMMM YYYY hh:mm:ss')
	}

	get notactive () {
		return !!this._notactive
	}

	set notactive (val) {
		this._notactive = val
	}
}
