import BaseModel from '@/lib/BaseModel'
import { Invoice } from '@/lib'

export default class AdSource extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			invoices: [Invoice]
		}, arg)
	}
}
