import BaseModel from '@/lib/BaseModel'

const vat = 18

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
		return Math.ceil(
			this.discountType ?
				this.originalPrice - this.discount
			:	this.originalPrice * ((100 - this.discount) / 100)
		)
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

	get priceWOVat () {
		return this.price - this.vatSumm
	}

	get priceWOVatString () {
		return this.priceWOVat.toFixed(2)
	}

	get originalPriceWOVat () {
		return this.originalPrice - this.vatSumm
	}

	get originalPriceWOVatString () {
		return this.originalPriceWOVat.toFixed(2)
	}

	get originalPriceXCount () {
		return this.originalPrice * +this.count
	}

	get priceXCount () {
		return this.price * +this.count
	}

	get priceXCountString () {
		return this.priceXCount.toFixed(2)
	}

	get vatSummXCount () {
		return this.vatSumm * this.count
	}

	get vatSummXCountString () {
		return this.vatSummXCount.toFixed(2)
	}

	get discountXCount () {
		return this.discountType ? this.discount * this.count : this.discount
	}

	get discountXCountString () {
		return this.discountXCount + ' ' + this.discountTypeString
	}
}
