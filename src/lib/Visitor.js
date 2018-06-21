import BaseModel from '@/lib/BaseModel'
import { Salon, Manager } from '@/lib'
import moment from 'moment'

export default class Visitor extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			salon: Salon,
			manager: Manager
		}, arg)
	}

	get canRemove () {
		return !moment(this.date).diff(moment(), 'days')
	}
}
