import BaseModel from '@/lib/BaseModel'
import { Salon } from '@/lib'

export default class Manager extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			salon: Salon
		}, arg)
	}

	get fio () {
		return `${this.FIO} ${this.IMY} ${this.OTCH}`.trim()
	}
}
