import BaseModel from '@/lib/BaseModel'

export default class ReportResumeChartMonth extends BaseModel {
	constructor (...args) {
		super(...args)
	}

	get summ () {
		return Math.round((+this.summ_td + +this.summ_skl + +this.summ_zak) / 1000)
	}
}
