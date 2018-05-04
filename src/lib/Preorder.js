import BaseModel from '@/lib/BaseModel'
import moment from 'moment'
import { Manager, Salon, PreorderStatus } from '@/lib'

export default class Preorder extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			manager: Manager,
			salon: Salon,
			status: PreorderStatus
		}, arg)
	}
}
