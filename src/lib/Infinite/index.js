class Infinite {
	constructor (options = {}) {
		if (typeof options.method != 'function')
			console.warn('Load more method was required')

		this.loadingAll = 0
		this.loadingMore = 0
		this.loadingPreload = 0

		this.cached = []
		this._preloaded = false
		this._filters = options.filters || []
		this._sort = options.sort || []

		this._offset = 0
		this._autoSetPreloaded = false

		this.pageSize = options.pageSize || 100
		this.method = options.method
	}

	async start (params = {}) {
		this._offset = 0

		this.loadingAll++
		let res = await this._load(params)
		this.loadingAll--

		if (!res.data || res.data.error) return

		this.cached = [...this.cached, ...res.data]
		this._offset += res.data.length

		this._preload(params)
	}

	async more (payload, params = {}) {
		if (this._preloaded != false) {
			console.log('mp');
			this.cached = [...this.cached, ...this._preloaded]
			this._preloaded = false
			payload.loaded()
		} else {
			if (this.loadingPreload) {
				console.log('msp');
				this._autoSetPreloaded = payload
			} else {
				console.log('ms');
				this.loadingMore++
				let res = await this._load(params)
				this.loadingMore--

				if (!res.data || res.data.error) return

				this.cached = [...this.cached, ...res.data]
				this._offset += res.data.length
				payload.loaded()
				if (!res.data.length)
					payload.complete()
			}
		}

		this._preload(params)
	}

	async _preload (params) {
		if (this.loadingPreload) return
		console.log('preload');

		this.loadingPreload++
		let res = await this._load(params)
		this.loadingPreload--

		console.log('preloaded', res);

		if (!res.data || res.data.error) return

		if (this._autoSetPreloaded === false) {
			this._preloaded = res.data
		} else {
			this.cached = [...this.cached, ...res.data]
			this._autoSetPreloaded.loaded()
			if (!res.data.length)
			 	this._autoSetPreloaded.complete()
			this._autoSetPreloaded = false
		}

		this._offset += res.data.length
	}

	async _load (params = {}) {
		return await this.method({
			limit: this.pageSize,
			offset: this._offset,
			filters: Object.assign(this._filters, params.filters),
			sort: Object.assign(this._sort, params.sort)
		})
	}

	get sort() {
		return this._sort
	}

	set sort (n) {
		this._sort = n
		this.start()
	}

	get filters () {
		return this._filters
	}

	set filters (n) {
		this._filters = n
		this.start()
	}
}


export default Infinite
