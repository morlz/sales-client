import BaseModel from '@/lib/BaseModel'
import { Cloth, Td } from '@/lib'
import moment from 'moment'

export default class Task extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get expired () {
		return moment(this.date).isBefore(moment()) && this.end_date === null
	}
}
