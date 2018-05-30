import BaseModel from '@/lib/BaseModel'
import { SalonGroupSetup, Manager } from '@/lib'

export default class SalonGroup extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			name: 'groupName',
			groupsSetup: [SalonGroupSetup],
			managers: [Manager]
		}, arg)
	}
}
