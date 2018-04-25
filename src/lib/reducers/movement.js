import reduceTd from '@/lib/reducers/td'
import reduceZak from '@/lib/reducers/zak'
import { date } from 'quasar'
import moment from 'moment'

export default movement => {
	return {
		shipments: movement.shipments.map(shipment => {
			let td = movement.td.filter(td => td.NZVR == shipment.ID_OTG).map((td, index) => {
				const cloths = [
						td.furniture.cloth1 ? td.furniture.cloth1.NAME : td.furniture.TKAN,
						td.furniture.cloth2 ? td.furniture.cloth2.NAME : td.furniture.KOMP,
						td.furniture.cloth3 ? td.furniture.cloth3.NAME : td.furniture.KOMP1,
					]
					.filter(el => el)
					.join(' / ')

				return {
					salon: td.salon ? td.salon.NAME : shipment.OTKUDA,
					index: index + 1,
					name: `${td.furniture.MODEL} ${td.TIP} ${cloths}`,
					count: +td.KOL,
					price: +td.CENA_ZAL,
					summ: +td.KOL * +td.CENA_ZAL
				}
			})

			return {
				n_doc: movement.N_DOC,
				date: moment(shipment.PL_OTGR).format('D MMMM YYYY'),
				from: td[0] ? td[0].salon : '...',
				to: movement.salon.NAME,
				td,
				summ: td.reduce((summ, td) => +td.summ + summ, 0)
			}
		})
	}
}
