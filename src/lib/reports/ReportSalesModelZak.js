import BaseModel from '@/lib/BaseModel'
import { Zak } from '@/lib'
import api from '@/api'

export default class ReportSalesModelZak extends Zak {
	constructor (arg) {
		super (arg)
	}

	get data () {
		return { model: `${this.MODEL} ${this.TIP}`, count: this.count }
	}
}
