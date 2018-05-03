import BaseModel from '@/lib/BaseModel'

export default class Zak extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get originalPrice () {
		return +this.CENA
	}

	get price () {
		return  this.discountType ? this.originalPrice - this.discount : this.originalPrice * ((100 - this.discount) / 100)
	}

	get discount () {
		return +this.SKIDKA
	}

	get discountString () {
		return this.discount + ' ' + this.discountTypeString
	}

	get discountType () {
		return +this.S_TYPE
	}

	get discountTypeString () {
		return this.discountType ? 'руб.' : '%'
	}

	get shipment_id () {
		return this.NZV ? +this.NZV : null
	}
}
