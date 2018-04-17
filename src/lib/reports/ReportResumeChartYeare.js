import BaseModel from '@/lib/BaseModel'
import ReportResumeChartMonth from './ReportResumeChartMonth'

export default class ReportResumeChartYeare extends BaseModel {
	constructor (months) {
		super()

		this.months = months
	}

	get months () {
		return this._months
	}

	set months (val) {
		if (!Array.isArray(val))
			return console.warn('Months must be an array')

		this._months = val.map(el => el instanceof ReportResumeChartMonth ? el : new ReportResumeChartMonth(el))
	}
}
