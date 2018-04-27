import { BaseModel, Shipment, Payment, Manager, Salon, Zak, Td } from '@/lib'


export default class Invoice extends BaseModel {
	constructor (arg) {
		super(arg)
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

	get payments () {
		return this._payments || []
	}

	set payments (val) {
		if (!Array.isArray(val))
			return console.warn('Invoice payments must be an Array')

		this._payments = val.map(el => el instanceof Payment ? el : new Payment(el))
	}

	get zak () {
		return this._zak || []
	}

	set zak (val) {
		if (!Array.isArray(val))
			return console.warn('Invoice zak must be an Array')

		this._zak = val.map(el => el instanceof Zak ? el : new Zak(el))
	}

	get td () {
		return this._td || []
	}

	set td (val) {
		if (!Array.isArray(val))
			return console.warn('Invoice td must be an Array')

		this._td = val.map(el => el instanceof Td ? el : new Td(el))
	}

	get shipments () {
		return this._shipments || []
	}

	set shipments (val) {
		if (!Array.isArray(val))
			return console.warn('Invoice shipments must be an Array')

		this._shipments = val.map(el => el instanceof Shipment ? el : new Shipment(el))
	}

	get manager () {
		return this._manager
	}

	set manager (val) {
		if (typeof val !== 'object')
			return console.warn('Invoice salon must be an Object')

		this._manager = val instanceof Manager ? val : new Manager(val)
	}

	get salon () {
		return this._salon
	}

	set salon (val) {
		if (typeof val !== 'object')
			return console.warn('Invoice manager must be an Object')

		this._salon = val instanceof Salon ? val : new Salon(val)
	}
}
