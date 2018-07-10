import BaseModel from '@/lib/BaseModel'
import ReportMainSalon from '@/lib/reports/ReportMainSalon'
import api from '@/api'

export default class ReportMain extends BaseModel {
	constructor (arg) {
		super ()
		this.define({
			salons: [ReportMainSalon]
		}, arg)
	}

	static async get () {
		return this.wrap(await api.core.get('report/main'), 'salons')
	}
}
