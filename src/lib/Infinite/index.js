import EventEmitter from 'browser-event-emitter'
import merge from 'lodash.merge'


class Infinite extends EventEmitter {
	constructor (options = {}) {
		super()

		if (typeof options.method != 'function')
			console.error('Load more method was required')

		this.loadingAll = 0
		this.loadingMore = 0
		this.loadingPreload = 0

		this._cached = []
		this._preloaded = false
		this._filters = options.filters || {}
		this._sort = options.sort || {}
		this._additional = options.additional || {}

		this._offset = 0
		this._autoSetPreloaded = false
		this._complete = false

		this.pageSize = options.pageSize || 100
		this.method = options.method
	}

	async start (params = {}) {
		this.complete = false
		this._offset = 0
		this._preloaded = false

		this.loadingAll++
		let res = await this._load(params)
		this.loadingAll--

		if (res.data === undefined || res.data.error) return

		this.cached = res.data
		this._offset = res.data.length

		this.emit('started', this.cached)
		this._preload(params)
	}

	async more (payload, params = {}) {
		if (this._preloaded != false) {
			this.cached = [...this.cached, ...this._preloaded]
			this._preloaded = false
			payload.loaded()
		} else {
			if (this.loadingPreload) {
				this._autoSetPreloaded = payload
			} else {
				this.loadingMore++
				let res = await this._load(params)
				this.loadingMore--

				if (res.data === undefined || res.data.error) return

				this.cached = [...this.cached, ...res.data]
				this._offset += res.data.length
				payload.loaded()
				if (!res.data.length) {
					this.complete = true
					payload.complete()
				}
			}
		}

		this._preload(params)
		this.emit('loaded', this.cached)
	}

	async _preload (params) {
		if (this.loadingPreload) return

		this.loadingPreload++
		let res = await this._load(params)
		this.loadingPreload--

		if (res.data === undefined || res.data.error) return

		if (this._autoSetPreloaded === false) {
			this._preloaded = res.data
		} else {
			this.cached = [...this.cached, ...res.data]
			this._autoSetPreloaded.loaded()
			if (!res.data.length) {
				this.complete = true
				this._autoSetPreloaded.complete()
			}
			this._autoSetPreloaded = false
		}

		this._offset += res.data.length
		this.emit('preloaded', this.cached)
	}

	async _load (params = {}) {
		return await this.method( merge({
			limit: this.pageSize,
			offset: this._offset,
			filters: this._filters,
			sort: this._sort
		}, params, this._additional) )
	}

	get sort() {
		return this._sort
	}

	set sort (n) {
		this._sort = n
	}

	get filters () {
		return this._filters
	}

	set filters (n) {
		this._filters = n
	}

	get additional () {
		return this._additional
	}

	set additional (n) {
		this._additional = n
	}

	get complete () {
		return this._complete
	}

	set complete (n) {
		this._complete = n
		this.emit('complete', n)
	}

	get cached () {
		return this._cached
	}

	set cached (n) {
		this._cached = n
		this.emit('cached', n)
	}
}


export default Infinite
