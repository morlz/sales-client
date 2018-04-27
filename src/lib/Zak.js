import BaseModel from '@/lib/BaseModel'

export default class Zak extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get price () {
		return  +this.S_TYPE ? +this.CENA : +this.CENA * ((100 - +this.SKIDKA) / 100) - +this.SKIDKA
	}
}
