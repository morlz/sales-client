import BaseModel from '@/lib/BaseModel'

export default class Shipment extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get price () {
		return +this.SUM_DOST
	}
}
