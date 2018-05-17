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

	get old () {
		return this.IDK !== undefined
	}

	get lastname () {
		return (this.old ? this.FIO : this._lastname || '').trim()
	}

	set lastname (val) {
		if (this.old) {
			this.FIO = val
		} else {
			this._lastname = val
		}
	}

	get name () {
		return (this.old ? this.IMY : this._name || '').trim()
	}

	set name (val) {
		if (this.old) {
			this.IMY = val
		} else {
			this._name = val
		}
	}

	get patronymic () {
		return (this.old ? this.OTCH : this._patronymic || '').trim()
	}

	set patronymic (val) {
		if (this.old) {
			this.OTCH = val
		} else {
			this._patronymic = val
		}
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
