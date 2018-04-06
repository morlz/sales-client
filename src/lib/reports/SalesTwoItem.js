class SalesTwoItem {
	constructor (source, options = {}) {
		this._source = source
	}

	get isZak () {
		return this._source.hasOwnProperty('VIP')
	}

	get model () {
		if (this.isZak)
			return this._source.MODEL

		return this._source.furniture.MODEL
	}

	get n_doc () {
		return this._source.invoice.N_DOC
	}

	get date () {
		return this._source.invoice.DATE
	}

	get salon () {
		return this._source.salon.NAME
	}

	get manager () {
		return this._source.invoice.manager.fio
	}

	get type () {
		return this._source.TIP
	}

	get from () {
		if (this.isZak)
			return 'Заказ'

		if (this._source.ID_SALONA in [0, 10, 1040, 40, 122])
			return 'Склад'

		return 'Подиум'
	}

	get cloth1 () {
		if (this.isZak)
			return this._source.TKAN

		return this._source.furniture.TKAN
	}

	get cloth2 () {
		if (this.isZak)
			return this._source.KOMP

		return this._source.furniture.KOMP
	}

	get cloth3 () {
		if (this.isZak)
			return this._source.KOMP1

		return this._source.furniture.KOMP1
	}

	get kat () {
		if (this.isZak)
			return this._source.KAT

		return this._source.furniture.KAT
	}

	get price () {
		if (this.isZak)
			return +this._source.CENA

		return +this._source.CENA_ZAL
	}

	get discount () {
		let discount = +this._source.SKID || +this._source.SKIDKA

		if (!discount)
			return '-'

		if (+this._source.S_TYPE)
			return `${+discount} руб.`

		return `${+discount}%`
	}

	get priceWithDiscount () {
		return +this._source.PRICE_DISC
	}

	static groupByField (arr, field) {
		let res = {}

		if (!Array.isArray(arr))
			return {}

		for (const el of arr) {
			if (!res[ el[field] ])
				res[ el[field] ] = []

			res[ el[field] ].push(el)
		}

		return res
	}
}

export default SalesTwoItem
