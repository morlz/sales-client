import BaseModel from '@/lib/BaseModel'

const vat = 13.5

export default class Zak extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			count: 'KOLL',
			dax: 'V_DAX'
		}, arg)
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

	get vat () {
		return vat
	}

	get vatString () {
		return this.vat + '%'
	}

	get vatSumm () {
		return this.price * this.vat / 100
	}

	get vatSummString () {
		return this.vatSumm.toFixed(2)
	}

	get priceWithVat () {
		return this.price + this.vatSumm
	}

	get priceWithVatString () {
		return this.priceWithVat.toFixed(2)
	}
}
