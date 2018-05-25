import BaseModel from '@/lib/BaseModel'
import { Shipment, Payment, Manager, Salon, Zak, Td, Marker, Client, AdSource } from '@/lib'
import api from '@/api'


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
			adSource: AdSource,
			dax: 'VDAX'
		}, arg)
	}

	get canRemove () {
		return !(
			(this.td || []).reduce((prev, el) => +el.VDAX + prev, 0) +
			(this.zak || []).reduce((prev, el) => +el.V_DAX + prev, 0)
		)
	}

	get paid () {
		return (this.payments || []).reduce((summ, payment) => summ + payment.amount, 0)
	}

	get price () {
		return 	this.td.reduce((summ, td) => summ + td.price, 0) +
				this.zak.reduce((summ, zak) => summ + +zak.price, 0) +
				this.shipments.reduce((summ, ship) => summ + +ship.price, 0)
	}

	get need () {
		return this.price - this.paid
	}

	setAxState (value = true) {
		this.VDAX = value
		this.td.map(el => el.VDAX = value)
		this.zak.map(el => el.V_DAX = value)
		return this
	}

	async updateSumm () {
		if (!Number.isInteger(this.price))
			return console.warn('Invoice price is NaN')

		let res = await api.invoices.updateSumm({ id: this.ID, value: this.price })
		if (!res.data || res.data.error) return

		return this.update(res.data)
	}
}
