import BaseModel from '@/lib/BaseModel'
import { SalonGroup } from '@/lib'

export default class Salon extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			group: SalonGroup
		}, arg)
	}

	get id () {
		return +this.ID_SALONA
	}

	get name () {
		return this.NAME
	}
}
