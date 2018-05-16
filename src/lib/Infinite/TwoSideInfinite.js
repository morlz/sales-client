import EventEmitter from 'browser-event-emitter'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'


export default class TwoSideInfinite extends EventEmitter {
	constructor (options = {}) {
		super()

		if (typeof options.method != 'function')
			throw new Error('Load more method was required')

		this.options = {
			namespacePrefix: '_',
			namespace: 'infinite',
			limit: 200,
			firstLimit: 60,
			...options
		}

		this._cached = {
			view: [],
			preload: {
				prev: [],
				next: []
			}
		}

		this._filters = {}
		this._sort = {}
		this._additional = {}

		this._init()
	}

	async start (params = {}) {
		this.reset()
		this.loading = { next: true }
		let res = await this._load({ ...params, limit: this.options.firstLimit, offset: 0 })
		this.loading = { next: false }

		if (res.data === undefined || res.data.error || res.data.errors) return

		this._cacheAppend(res.data)
		this._preloadNext(params)
	}

	prev (payload, params = {}) {
		if (this._loading.prev)
		 	return this.autoSetPreloaded = { prev: payload }

		if (this._cached.preload.prev.length) {
			this._cachePrepend(this._cached.preload.prev)
			this.preloaded = { prev: [] }
		} else {
			this.loading = { prev: true }
			let res = await this._load({ ...params, limit: this.options.firstLimit, offset: this._offset.prev })
			this.loading = { prev: false }

			if (res.data === undefined || res.data.error || res.data.errors) return

			this._cachePrepend(res.data)
		}

		this._handlePayload(payload, 'prev')
		this._preloadPrev(params)
	}

	next (payload, params = {}) {
		if (this._loading.next)
		 	return this.autoSetPreloaded = { next: payload }

		if (this._cached.preload.next.length) {
			this._cacheAppend(this._cached.preload.next)
			this.preloaded = { next: [] }
		} else {
			this.loading = { next: true }
			let res = await this._load({ ...params, limit: this.options.firstLimit, offset: this._offset.next })
			this.loading = { next: false }

			if (res.data === undefined || res.data.error || res.data.errors) return

			this._cacheAppend(res.data)
		}

		this._handlePayload(payload, 'next')
		this._preloadNext(params)
	}

	async _preloadPrev (params = {}) {
		this.loading = { preload: { prev: true } }
		let res = await this._load({ ...params, offset: this._offset.prev })
		this.loading = { preload: { prev: false } }

		if (res.data === undefined || res.data.error || res.data.errors) return

		this.preloaded = { prev: res.data }
	}

	async _preloadNext (params = {}) {
		this.loading = { preload: { next: true } }
		let res = await this._load({ ...params, offset: this._offset.next })
		this.loading = { preload: { next: false } }

		if (res.data === undefined || res.data.error || res.data.errors) return

		this.preloaded = { next: res.data }
	}

	async _load (params = {}) {
		return await this.method( merge({
			limit: this.options.limit,
			//offset: this._offset,
			filters: this._filters,
			sort: this._sort
		}, params, this._additional) )
	}

	_handlePayload (payload, type) {
		if (typeof payload == 'function')
			return payload(this.cached.list)

		if (typeof payload !== 'object' || payload === null) return
		if (typeof payload.loaded === 'function')
			payload.loaded(this.cached.list)

		if (typeof payload.comlete === 'function' && this.comlete[type])
			payload.comlete(this.cached.list)
	}

	_cacheAppend (values) {
		this.cached = { view: this._cached.view.concat(values) }
		this.offset = { next: this._offset.next + values.length }

		if (!values || !values.length)
			this.complete = { next: true }
	}

	_cachePrepend (values) {
		this.cached = { view: values.concat(this._cached.view) }
		this.offset = { prev: this._offset.prev - values.length }

		if (!values || !values.length)
			this.complete = { prev: true }
	}

	_init () {
		this.reset()
	}

	reset() {
		this._complete = {
			prev: false,
			next: false
		}
		this._offset = {
			prev: 0,
			next: 0
		}
		this._setOnComplete = {
			prev: false,
			next: false
		}
		this._loading = {
			prev: false,
			next: false,
			preload: {
				prev: false,
				next: false
			}
		}
		this._autoSetPreloaded = {
			prev: false,
			next: false
		}
	}

	set preloaded (value) {
		Object.keys(value).map(key => {
			if (this._autoSetPreloaded[key]) {
				;(key == 'prev' ? this._cachePrepend : this._cacheAppend)(value[key])
				this._cached.preload[key] = []
				if (typeof this._autoSetPreloaded[key].loaded === 'function')
					this._autoSetPreloaded[key].loaded(value[key])

				if (typeof this._autoSetPreloaded[key].complete === 'function' && (!value[key] || !value[key].length))
					this._autoSetPreloaded[key].complete(value[key])
			} else {
				this._cached.preload[key] = value[key]
			}
		})
	}

	set autoSetPreloaded (value) {
		this._autoSetPreloaded = merge(this._autoSetPreloaded, value)
	}

	get loading () {
		return this._loading
	}

	set loading (value) {
		this._loading = merge(this._loading, value)
		this.emit('loading', this._loading)
	}

	get complete () {
		return this._complete
	}

	set complete (value) {
		this._complete = merge(this._complete, value)
		this.emit('complete', this._complete)
	}

	get offset () {
		return this._offset
	}

	set offset (value) {
		this._offset = merge(this._offset, value)
		this.emit('offset', this._offset)
	}

	get cached () {
		return this._cached
	}

	set cached (value) {
		this._cached = merge(this._cached, value)
		this.emit('cached', this._cached)
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

	get namespacePrefix () {
		return this.options.namespacePrefix
	}

	set namespacePrefix (n) {
		this.options.namespacePrefix = n
	}

	get namespace () {
		return this.options.namespace
	}

	set namespace (n) {
		this.options.namespace = n
	}

	static getState (options) {
		return {
			cached: {
				list: []
			},
			loading: {
				list: {
					prev: false,
					next: false
				}
			},
			complete: {
				prev: false,
				next: false
			},
			infinite: null
		}
	}

	static getActions (options = {}, namespaced = false) {
		let res = {
			async init ({ commit, dispatch, state }) {
				if (state.infinite) return
				let infinite = new this(options)
				infinite.on('loading', list => commit(this._getNamespace(namespaced) + 'loadingSet', { list }))
				infinite.on('cached', list => commit(this._getNamespace(namespaced) + 'cachedSet', { list }))
				infinite.on('complete', complete => commit(this._getNamespace(namespaced) + 'completeSet', complete))
				commit(this._getNamespace(namespaced) + 'infiniteSet', infinite)
			},
			async start ({ commit, dispatch, state }) {
				await state.infinite.start()
			},
			async prev ({ commit, dispatch, state }, payload) {
				await state.infinite.prev(payload)
			},
			async next ({ commit, dispatch, state }, payload) {
				await state.infinite.next(payload)
			},
		}

		return namespaced ? this._withNamespace(res) : res
	}

	static getMutations (namespaced = false) {
		let res = {
			cachedSet: (state, payload) => state.cached = { ...state.cached, ...payload },
			loadngSet: (state, payload) => state.loading = { ...state.cached, ...payload },
			completeSet: (state, payload) => state.complete = { ...state.cached, ...payload },
			infiniteSet: (state, payload) => state.infinite = payload
		}

		return namespaced ? this._withNamespace(res) : res
	}

	static getGetters (namespaced = false) {
		let res = {}

		return namespaced ? this._withNamespace(res) : res
	}

	_withNamespace (obj) {
		return Object.keys(obj).reduce((prev, key) => { ...prev, [this.namespace + this.namespacePrefix + key]: obj[key] }, {})
	}

	_getNamespace(show = false) {
		return show ? this.namespace + this.namespacePrefix : ''
	}

}
