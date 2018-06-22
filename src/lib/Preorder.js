import BaseModel from '@/lib/BaseModel'
import moment from 'moment'
import { Manager, Salon, PreorderStatus, Invoice } from '@/lib'

export default class Preorder extends BaseModel {
	baseUrl = '/preorder/preorders/{id}'
	
	constructor (arg) {
		super()
		this.define({
			manager: Manager,
			salon: Salon,
			status: PreorderStatus,
			invoice: Invoice
		}, arg)
	}
}
