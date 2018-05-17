import BaseModel from '@/lib/BaseModel'
import { Shipment, Payment, Manager, Salon, Zak, Td, Marker, Client, AdSource } from '@/lib'

export default class Invoice extends BaseModel {
	constructor (arg) {
		super()
		this.define({
			payments: [Payment],
			shipments: [Shipment],
			zak: [Zak],
			td: [Td],
			salon: Salon,
			manager: Manager,
			storage: Salon,
			marker: Marker,
			client: Client,
			clientOld: Client,
			adSource: AdSource
		}, arg)
	}

	get canRemove () {
		return !(
			(this.td || []).reduce((prev, el) => +el.VDAX + prev, 0) +
			(this.zak || []).reduce((prev, el) => +el.V_DAX + prev, 0)
		)
	}

	get paid () {
		return (this.payments || []).reduce((summ, payment) => summ + +payment.SUM_OPL, 0)
	}

	get price () {
		return 	this.td.reduce((summ, td) => summ + td.price, 0) +
				this.zak.reduce((summ, zak) => summ + +zak.price, 0) +
				this.shipments.reduce((summ, ship) => summ + +ship.price, 0)
	}

	get need () {
		return this.price - this.paid
	}
}
