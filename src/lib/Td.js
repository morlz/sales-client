import BaseModel from '@/lib/BaseModel'

export default class Td extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get price () {
		return  +this.S_TYPE ? +this.CENA_ZAL : +this.CENA_ZAL * ((100 - +this.SKID) / 100) - +this.SKID
	}
}
