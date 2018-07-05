import BaseModel from '@/lib/BaseModel'
import { Salon, SalonGroup, SalonGroupSetup } from '@/lib'

export default class Manager extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			salon: Salon,
			groups: [SalonGroup],
			groupsSetup: [SalonGroupSetup],
			id: 'ID_M'
		}, arg)
	}

	get fio () {
		return `${this.FIO} ${this.IMY} ${this.OTCH}`.trim()
	}

	get name () {
		return this.IMY.trim()
	}

	get avatar () {
		return 'https://quasar-framework.org/quasar-play/android/statics/linux-avatar.png'
	}
}
