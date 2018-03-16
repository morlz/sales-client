import EventEmitter from 'browser-event-emitter'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'


class Infinite extends EventEmitter {
	constructor (options = {}) {
		super()

		if (typeof options.method != 'function')
			console.error('Load more method was required')

		this._loadingAll = 0
		this._loadingMore = 0
		this._loadingPreload = 0
		this._lastLoadingState = false

		this._cached = []
		this._preloaded = false
		this._filters = options.filters || {}
		this._sort = options.sort || {}
		this._additional = options.additional || {}

		this._offset = 0
		this._autoSetPreloaded = false
		this._complete = false

		this.pageSize = options.pageSize || 200
		this.method = options.method
		this.log = options.log || false

		if (this.log) console.log('[inf] [init]')
	}

	async start (params = {}) {
		if (this.log) console.log('[inf] [start] start');
		this.complete = false
		this._offset = 0
		this._preloaded = false

		this.loadingAll++
		let res = await this._load(params)
		this.loadingAll--

		if (this.log) console.log('[inf] [start] end');

		if (res.data === undefined || res.data.error) return

		this.cached = res.data
		this._offset = res.data.length
		if (!res.data || !res.data.length)
			this.complete = true

		this.emit('started', this.cached)
		this._preload(params)
	}

	async more (payload, params = {}) {
		if (this._preloaded != false) {
			if (this.log) console.log('[inf] [more] from memory');
			this.cached = [...this.cached, ...this._preloaded]
			this._preloaded = false
			payload.loaded()
			if (!this._preloaded) {
				this.complete = true
				payload.complete()
			}
		} else {
			if (this.loadingPreload) {
				if (this.log) console.log('[inf] [more] wait for preload');
				this._autoSetPreloaded = payload
			} else {
				if (this.log) console.log('[inf] [more] loading start');
				this.loadingMore++
				let res = await this._load(params)
				this.loadingMore--

				if (res.data === undefined || res.data.error) return
				if (this.log) console.log('[inf] [more] loading end');

				this.cached = [...this.cached, ...res.data]
				this._offset += res.data.length
				payload.loaded()
				if (!res.data || !res.data.length) {
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
		if (this.log) console.log('[inf] [preload] start');

		this.loadingPreload++
		let res = await this._load(params)
		this.loadingPreload--

		if (res.data === undefined || res.data.error) return
		if (this.log) console.log('[inf] [preload] end');

		if (this._autoSetPreloaded === false) {
			this._preloaded = res.data
			if (this.log) console.log('[inf] [preload] set data in memory');
		} else {
			if (this.log) console.log('[inf] [preload] set data in cache')
			this.cached = [...this.cached, ...res.data]
			this._autoSetPreloaded.loaded()
			if (!res.data || !res.data.length) {
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

	loadingChange () {
		let loading = {
			start: !!this.loadingAll,
			more: !!this.loadingMore || !!this.loadingPreload
		}

		if (isEqual(loading, this._lastLoadingState)) return

		this._lastLoadingState = loading
		this.emit('loading', loading)
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

	get loadingAll () {
		return this._loadingAll
	}

	set loadingAll (n) {
		this._loadingAll = n
		this.loadingChange()
	}

	get loadingMore () {
		return this._loadingMore
	}

	set loadingMore (n) {
		this._loadingMore = n
		this.loadingChange()
	}

	get loadingPreload () {
		return this._loadingPreload
	}

	set loadingPreload (n) {
		this._loadingPreload = n
		this.loadingChange()
	}
}

export default Infinite
