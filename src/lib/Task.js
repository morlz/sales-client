import BaseModel from '@/lib/BaseModel'
import { Manager, Client } from '@/lib'
import moment from 'moment'
import api from '@/api'

export default class Task extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			managerresponsible: Manager,
			client: Client,
		}, arg)
	}

	get expired () {
		return moment(this.date).add(1, 'day')
			.isBefore(moment()) && this.end_date === null
	}

	get next () {
		return moment(this.date)
			.isAfter(moment()) && this.end_date === null
	}

	static async getForUserCurrent () {
		return this.wrapArray(await api.core.get('task/current'))
	}

	static async getForSalonCurrent () {
		return this.wrapArray(await api.core.get('task/current-salon'))
	}
}
