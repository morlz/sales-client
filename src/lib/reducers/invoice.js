import reduceTd from '@/lib/reducers/td'
import reduceZak from '@/lib/reducers/zak'
import { date } from 'quasar'

export default invoice => {
	let paid = invoice.oplata.reduce((prev, el) => prev + +el.SUM_OPL, 0)

	return {
		...invoice,
		products: [...invoice.zak.map(reduceZak), ...invoice.td.map(reduceTd)],
		paid,
		now: {
			date: new Date().toLocaleString('ru', { year: 'numeric', month: 'long', day: 'numeric' }),
			datetime: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss')
		},
		allSumm () {
			return +this.SUMMA_ZAKAZA + this.shipmentSumm()
		},
		leftToPay () {
			return this.allSumm() - this.paid
		},
		clientName () {
			if (this.client) return `${this.client.lastname} ${this.client.name} ${this.client.patronymic}`
			if (this.clientOld) return `${this.clientOld.FIO} ${this.clientOld.IMY} ${this.clientOld.OTCH}`
			return 'Error compiling template!! Client not found.'
		},
		shipmentType () {
			return this.shipment().VIDDOST == 'Самовывоз' ?
						'Самовывоз'
					:	this.shipmentSumm() > 0 ?
							'Доставка + Подъем + Сборка'
						:	'Доставка'
		},
		shipmentCount () {
			return this.shipments.length
		},
		shipmentSumm () {
			return this.shipments.reduce((prev, el) => prev + +el.SUM_DOST, 0)
		},
		shipment () {
			return this.shipments[0]
		},
		productReadyDate () {
			return this.shipment().PL_OTGR
		},
		shipmentAddr () {
			return this.shipment().KUDA
		},
		shipmentPhone1 () {
			return this.shipment().TEL1
		},
		shipmentPhone2 () {
			return this.shipment().TEL2
		},
		shipmentEmail () {
			if (this.client) return this.client.contactfaces.find(el => el.regard == 'Основной').email
			if (this.clientOld) return this.clientOld.EMAIL
			return 'Error template compiling!! Client not found.'
		},
		hasPayment () {
			return this.oplata && this.oplata.length
		}
	}
}
