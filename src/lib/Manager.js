import BaseModel from '@/lib/BaseModel'
import { Salon, SalonGroup, SalonGroupSetup } from '@/lib'

export default class Manager extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			salon: Salon,
			groups: [SalonGroup],
			groupsSetup: [SalonGroupSetup]
		}, arg)
	}

	get fio () {
		return `${this.FIO} ${this.IMY} ${this.OTCH}`.trim()
	}
}
