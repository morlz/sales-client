import BaseModel from '@/lib/BaseModel'
import { SalonGroup, Manager } from '@/lib'

export default class SalonGroupSetup extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			group: SalonGroup,
			manager: Manager
		}, arg)
	}
}
