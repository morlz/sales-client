import BaseModel from '@/lib/BaseModel'
import { Manager } from '@/lib'
import moment from 'moment'

export default class Task extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			managerresponsible: Manager
		}, arg)
	}

	get expired () {
		return moment(this.date).isBefore(moment()) && this.end_date === null
	}
}
