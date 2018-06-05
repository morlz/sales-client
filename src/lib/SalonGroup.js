import BaseModel from '@/lib/BaseModel'
import { SalonGroupSetup, Manager } from '@/lib'

export default class SalonGroup extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			name: 'groupName',
			groupsSetup: [SalonGroupSetup],
			managers: [Manager]
		}, arg)
	}

	static get fields () {
		return ['id', 'groupName']
	}

	static get options () {
		return {
			isActive: 'isActive',
			isMebelTransport: 'isMebelTransport',
			isReserveToAx: 'isReserveToAx',
			isExportToAx: 'isExportToAx',
			isInvoicePrintOpt: 'Оптовая печать заказа'
		}
	}

	pure () {
		return (Object.keys(SalonGroup.options).concat(SalonGroup.fields))
			.reduce((prev, option) => ( prev[option] = this[option], prev ), {})
	}
}
