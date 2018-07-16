import BaseModel from '@/lib/BaseModel'
import { Td } from '@/lib'
import api from '@/api'

export default class ReportSalesModelTd extends Td {
	constructor (arg) {
		super (arg)
	}

	get data () {
		return { model: `${this.furniture.MODEL} ${this.furniture.TIP}`, count: this.count }
	}
}
