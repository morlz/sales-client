import BaseModel from '@/lib/BaseModel'
import { Invoice } from '@/lib'

export default class AdSource extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			invoices: [Invoice],
			name: 'NAME',
			id: 'ID'
		}, arg)
	}

	get invoicesPriceSumm () {
		return this.invoices.reduce((prev, el) => prev + +el.cachedPrice, 0)
	}

	get invoiceCount () {
		return this.invoices.length
	}

	of (all) {
		return (this.invoicesPriceSumm / all * 100).toFixed(2)
	}

	isZero (adSources) {
		return adSources[this.id] instanceof AdSource ? adSources[this.id].invoiceCount == 0 : true
	}
}
