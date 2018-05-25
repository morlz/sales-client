import groupBy from 'lodash.groupby'
import { AdSource, Salon } from '@/lib'

export default class ReportAdSalon extends Salon {
	constructor (invoices, salon_id) {
		super(invoices[0].salon)
		this.update({
			adSources: {},
			salon_id,
			invoices,
		})
	}

	set invoices (value) {
		let ad = groupBy(value, 'REKLAMA_ID')
		Object.keys(ad).map(adKey =>
			this.adSources[adKey] = (
				ad[adKey][0].adSource instanceof AdSource ?
					ad[adKey][0].adSource.clone()
				:	new AdSource(ad[adKey][0].adSource)
			).update({ invoices: ad[adKey] })
		)

		this._invoices = value
	}

	get invoices () {
		return this._invoices
	}
}
