import BaseModel from '@/lib/BaseModel'
import moment from 'moment'

export default class Shipment extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			rows: Array
		}, arg)
	}

	get price () {
		return +this.SUM_DOST
	}

	get date () {
		return moment(this.PL_OTGR).format('DD MMMM YYYY')
	}

	get timeFormNow () {
		return moment(this.PL_OTGR).fromNow()
	}

	get id () {
		return this.ID_OTG
	}

	get typeString () {
		if (this.VIDDOST == 'Самовывоз')
			return this.VIDDOST

		return this.price > 0 ? 'Доставка + Подъем + Сборка' : 'Доставка'
	}

	get count () {
		return this.rows.length || 1
	}

	get inputDate () {
		return moment(this.DATEV).format('DD MMMM YYYY')
	}
}
