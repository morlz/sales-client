import BaseModel from '@/lib/BaseModel'
import moment from 'moment'

export default class Payment extends BaseModel {
	constructor (arg) {
		super(arg)
	}

	get canDelete () {
		return moment(this.DATE_OPL).add(1, 'day').valueOf() > moment().valueOf()
	}
}
