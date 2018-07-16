import BaseModel from '@/lib/BaseModel'
import ReportSalesModelZak from '@/lib/reports/ReportSalesModelZak'
import ReportSalesModelTd from '@/lib/reports/ReportSalesModelTd'
import api from '@/api'
import groupBy from 'lodash.groupby'

export default class ReportSalesModel extends BaseModel {
	constructor (arg) {
		super ()
		this.define({
			order: [ReportSalesModelZak],
			podium: [ReportSalesModelTd],
			storage: [ReportSalesModelTd]
		}, arg)
	}

	static async get () {
		return this.wrap(await api.core.get('report/sales-model'), 'order')
	}

	get chart () {
		let datasets = [],
			labels = [],
			data = []

		this.groupedData.map(el => {
			data.push(el.count)
			labels.push(el.model)
		})

		datasets.push({
			data,
			label: 'Модели'
		})

		return {
			datasets,
			labels
		}
	}

	get groupedData () {
		let data = [
			...this.order.map(el => el.data),
			...this.podium.map(el => el.data),
			...this.storage.map(el => el.data)
		]

		let grouped = groupBy(data, 'model')

		return Object
			.keys(grouped)
			.map(key => ({
				model: key,
				count: grouped[key].reduce((sum, el) => sum + +el.count, 0)
			}))
			.sort( api.core.sortFnFactory( item => +item.count ) )
	}
}
