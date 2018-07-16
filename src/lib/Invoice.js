import BaseModel from '@/lib/BaseModel'
import { Shipment, Payment, Manager, Salon, Zak, Td, Marker, Client, AdSource, Preorder } from '@/lib'
import api from '@/api'


export default class Invoice extends BaseModel {
	baseUrl = '/docs/invoices/{id}'

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
			preorder: Preorder,
			lastShippedShipment: Shipment,
			firstNotShippedShipment: Shipment,
			realDax: 'VDAX',
			cachedPrice: 'SUMMA_ZAKAZA',
			id: 'ID'
		}, arg)
	}

	get currentShipment () {
		return this.firstNotShippedShipment || this.lastShippedShipment
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
		return 	this.priceWOShipments + this.shipmentsPrice
	}

	get priceString () {
		return this.price.toFixed(2)
	}

	get vat () {
		return 	this.td.reduce((summ, td) => summ + td.vatSummXCount, 0) +
				this.zak.reduce((summ, zak) => summ + +zak.vatSummXCount, 0)
	}

	get vatString () {
		return this.vat.toFixed(2)
	}

	get priceWOShipments () {
		return 	this.td.reduce((summ, td) => summ + td.price, 0) +
				this.zak.reduce((summ, zak) => summ + +zak.price, 0)
	}

	get shipmentsPrice () {
		return this.shipments.reduce((summ, ship) => summ + +ship.price, 0)
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

		let res = await api.invoices.updateSumm({ id: this.ID, value: this.priceWOShipments })
		if (!res.data || res.data.error) return

		return this.update(res.data)
	}

	get dax () {
		return !(this.td || []).every(el => !el.dax) || (this.zak || []).every(el => !el.dax)
	}

	/**
	 * доп.условие на кнопку Отгрузить, к тому что в документе есть есть строка с салоном НЕ 0, (edited)
	 * Есть строка с салоном НЕ 0, и НЕ 40, и НЕ 122, и НЕ 1040, и (салон НЕ относится к группе ТС Ладья или все строки диваны_тд заказа имеют установленный ВДАКС)
	 * @param  Salon  salon Салон
	 * @return Boolean
	 */

	isShipShow (salon) {
		return this.td.some(el => ![0, 122, 40, 1040].includes(+el.salon.id)) && (this.salon.group != 1 || this.td.every(el => +el.dax))
	}
}
