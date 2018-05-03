import BaseModel from '@/lib/BaseModel'
import { Furniture } from '@/lib'

export default class Td extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			furniture: Furniture
		}, arg)
	}

	get originalPrice () {
		return +this.CENA_ZAL
	}

	get price () {
		return Math.ceil(this.discountType ? this.originalPrice - this.discount : this.originalPrice * ((100 - this.discount) / 100))
	}

	get discount () {
		return +this.SKID
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
		return this.NZVR ? +this.NZVR : null
	}
}
