class SalesSofaModel {
	constructor() {
		this.count = {
			podium: 0,
			storage: 0,
			order: 0
		}

		this.price = {
			podium: 0,
			storage: 0,
			order: 0
		}

		this.akc = {
			count: 0,
			price: 0
		}
	}

	get priceAll () {
		return Object.values(this.price).reduce((prev, el) => el + prev, 0)
	}

	get countAll () {
		return Object.values(this.count).reduce((prev, el) => el + prev, 0)
	}

	static summAllPrice (arr) {
		return {
			all: arr.reduce((prev, el) => prev + el.priceAll, 0),
			podium: arr.reduce((prev, el) => prev + el.price.podium, 0),
			storage: arr.reduce((prev, el) => prev + el.price.storage, 0),
			order: arr.reduce((prev, el) => prev + el.price.order, 0),
			akc: arr.reduce((prev, el) => prev + el.akc.price, 0)
		}
	}

	static summAllCount (arr) {
		return {
			all: arr.reduce((prev, el) => prev + el.countAll, 0),
			podium: arr.reduce((prev, el) => prev + el.count.podium, 0),
			storage: arr.reduce((prev, el) => prev + el.count.storage, 0),
			order: arr.reduce((prev, el) => prev + el.count.order, 0),
			akc: arr.reduce((prev, el) => prev + el.akc.count, 0)
		}
	}
}

export default SalesSofaModel
