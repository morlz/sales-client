import EventEmitter from 'browser-event-emitter'
import merge from 'lodash.merge'
import isEqual from 'lodash.isequal'
import api from '@/api'
import Vue from 'vue'


const wait = time => new Promise(resolve => setTimeout(resolve, time))


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
			debug: false,
			...options
		}

		this._filters = undefined
		this._sort = undefined
		this._additional = {}

		this._init()
	}

	async start (offset = 0, params = {}) {
		if (this.options.debug) this._log('start', offset)
		this.reset()

		api.scrollPosition.current.scroll = 0
		api.scrollPosition.current.offset = offset

		this.offset = { prev: offset, next: offset }

		this.loading = { next: true, prev: true }
		let res = await this._load({ ...params, limit: this.options.firstLimit, offset })
		this.loading = { next: false, prev: false }

		if (res.data === undefined || res.data.error || res.data.errors) return

		this._cacheSet(res.data)
		this._preloadPrev(params)
		this._preloadNext(params)
	}

	async more (payload, params = {}) {
		if (this.options.debug) this._warn('more', payload)
		if (!['prev', 'next'].includes(payload.type)) return

		return await this[payload.type](payload, params)
	}

	async prev (payload, params = {}) {
		if (this.options.debug) this._warn('prev', payload)
		if (this._loading.prev || this.autoSetPreloaded.prev)
		 	return this.autoSetPreloaded = { prev: payload }

		if (this._cached.preload_prev.length) {
			this._cachePrepend(this._cached.preload_prev)
			this._cached.preload_prev = []
			if (this.options.debug) this._log('prev from memory')
		} else {
			let offset = this._offset.prev - this.options.limit
			offset = offset < 0 ? 0 : offset

			this.loading = { prev: true }
			let res = await this._load({ ...params, offset, limit: this._offset.prev - offset })
			this.loading = { prev: false }

			if (res.data === undefined || res.data.error || res.data.errors) return

			this._cachePrepend(res.data)
			if (this.options.debug) this._log('prev from server')
		}

		this._handlePayload(payload, 'prev')
		this._preloadPrev(params)
	}

	async next (payload, params = {}) {
		if (this.options.debug) this._log('next', payload)
		if (this._loading.next || this.autoSetPreloaded.next)
		 	return this.autoSetPreloaded = { next: payload }

		if (this._cached.preload_next.length) {
			this._cacheAppend(this._cached.preload_next)
			this._cached.preload_next = []
			if (this.options.debug) this._log('next from memory')
		} else {
			this.loading = { next: true }
			let res = await this._load({ ...params, offset: this._offset.next })
			this.loading = { next: false }

			if (res.data === undefined || res.data.error || res.data.errors) return

			this._cacheAppend(res.data)
			if (this.options.debug) this._log('next from server')
		}

		this._handlePayload(payload, 'next')
		this._preloadNext(params)
	}

	async _preloadPrev (params = {}) {
		if (this.complete.prev) return
		if (this._offset.prev < 1) return
		if (this._cached.preload_prev.length) return

		let offset = this._offset.prev - this.options.limit
		offset = offset < 0 ? 0 : offset

		if (this.options.debug) this._log('preload prev', {
			'this._offset.prev': this._offset.prev,
			offset
		})

		this.loading = { preload: { prev: true } }
		let res = await this._load({ ...params, offset, limit: this._offset.prev - offset })
		this.loading = { preload: { prev: false } }

		if (res.data === undefined || res.data.error || res.data.errors) return

		this.preloaded = { prev: res.data }

		//work if preloaded set in cache
		if (this.complete.prev) return
		this._preloadPrev(params)
	}

	async _preloadNext (params = {}) {
		if (this.complete.next) return
		if (this._cached.preload_next.length) return
		if (this.options.debug) this._log('preload next', this._offset.next)

		this.loading = { preload: { next: true } }
		let res = await this._load({ ...params, offset: this._offset.next })
		this.loading = { preload: { next: false } }

		if (res.data === undefined || res.data.error || res.data.errors) return

		this.preloaded = { next: res.data }

		//work if preloaded set in cache
		if (this.complete.next) return
		this._preloadNext(params)
	}

	async _load (params = {}) {
		if (this.options.debug) this._log('_load', params)
		return await this.options.method( merge({
			limit: this.options.limit,
			//offset: this._offset,
			filters: this._filters,
			sort: this._sort
		}, params, this._additional) )
	}

	_handlePayload (payload, type) {
		if (this.options.debug) this._log('_handlePayload', payload)

		if (typeof payload == 'function')
			return payload(this.cached)

		if (typeof payload !== 'object' || payload === null) return
		if (typeof payload.loaded === 'function')
			payload.loaded(this.cached)

		if (typeof payload.comlete === 'function' && this.comlete[type])
			payload.comlete(this.cached)
	}

	_cacheSet (values) {
		if (this.options.debug) this._log('_cacheSet', values)

		if (!Array.isArray(values))
			throw new Error('[Infinite] [_cacheSet] Invalid response from server, Array required')

		this.cached = { view: values }
		this.offset = { next: this._offset.next + values.length }

		if (!values || !values.length)
			this.complete = { next: true }
	}

	_cacheAppend (values) {
		if (this.options.debug) this._log('_cacheAppend', values.length)

		if (!Array.isArray(values))
			throw new Error('[Infinite] [_cacheAppend] Invalid response from server, Array required')

		if (!values || !values.length)
			return this.complete = { next: true }

		this.cached = { view: [...this._cached.view, ...values] }
		this.offset = { next: this._offset.next + values.length }
	}

	_cachePrepend (values) {
		if (this.options.debug) this._log('_cachePrepend', values.length)

		if (!Array.isArray(values))
			throw new Error('[Infinite] [_cachePrepend] Invalid response from server, Array required')

		if (!values || !values.length)
			return this.complete = { prev: true }

		api.scrollPosition.current.convertOffsetToScroll(values.length)

		this.cached = { view: [...values, ...this._cached.view]}
		this.offset = { prev: this._offset.prev - values.length }
	}

	_init () {
		if (this.options.debug) this._log('_init')
		this.reset()
	}

	reset() {
		this._cached = {
			view: [],
			preload_prev: [],
			preload_next: [],
		}
		this.complete = {
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
			if (this.options.debug) this._log('set preloaded', key, value[key])

			if (this._autoSetPreloaded[key] !== false) {
				if (this.options.debug) this._log('set preloaded in cache')
				if (key == 'prev')
					this._cachePrepend(value[key])
				else
					this._cacheAppend(value[key])

				this._cached['preload_' + key] = []

				this._handlePayload(this._autoSetPreloaded[key], key)
				this.autoSetPreloaded = { [key]: false }
			} else {
				if (this.options.debug) this._log('set preloaded in memory')
				this._cached['preload_' + key] = value[key]
			}

			if (!value[key] || !value[key].length) {
				if (this.options.debug) this._log('set preloaded complete', key, value[key])
				this.complete = { [key]: true }
			}
		})
	}

	get autoSetPreloaded () {
		return this._autoSetPreloaded
	}

	set autoSetPreloaded (value) {
		this._autoSetPreloaded = merge(this._autoSetPreloaded, value)
		if (this.options.debug) this._log('set autoSetPreloaded', { ...this._autoSetPreloaded })
	}

	get loading () {
		return this._loading
	}

	set loading (value) {
		this._loading = merge(this._loading, value)
		this.emit('loading', this._loading)
		if (this.options.debug) this._log('set loading', { ...this._loading })
	}

	get complete () {
		return this._complete
	}

	set complete (value) {
		this._complete = merge(this._complete, value)
		this.emit('complete', this._complete)
		if (this.options.debug) this._log('set complete', { ...this._complete })
	}

	get offset () {
		return this._offset
	}

	set offset (value) {
		this._offset = merge(this._offset, value)
		this.emit('offset', this._offset)
		api.scrollPosition.setOffset(document.location.hash, this.offset.prev)
		if (this.options.debug) this._log('set offset', { ...this._offset })
	}

	get cached () {
		if (typeof this.options.returns === 'function')
			return this._cached.view.map(el => new this.options.returns(el))

		return this._cached.view
	}

	set cached (value) {
		if (this.options.debug) this._log('cached', { ...this._cached })
		this._cached = { ...this._cached, ...value }
		this.emit('cached', this.cached)
		if (this.options.debug) this._log('set cached', { ...this._cached })
	}

	get sort() {
		return this._sort || {}
	}

	set sort (n) {
		this._sort = Object.keys(n).length ? n : undefined
	}

	get filters () {
		return this._filters || {}
	}

	set filters (n) {
		this._filters = Object.keys(n).length ? n : undefined
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

	getState () {
		return {
			filters: {},
			sort: {},
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

	getActions (namespaced = false) {
		let res = {
			initInfinite: async ({ commit, dispatch, state, getters }) => {
				if (state.infinite) return

				this.filters = getters[this._getNamespace(namespaced) + 'filters']

				this.on('loading', list => commit(this._getNamespace(namespaced) + 'loadingSet', { list }))
				this.on('cached', list => commit(this._getNamespace(namespaced) + 'cachedSet', { list }))
				this.on('complete', complete => commit(this._getNamespace(namespaced) + 'completeSet', complete))
				commit(this._getNamespace(namespaced) + 'infiniteSet', this)
			},
			start: async ({ commit, dispatch, state }) => {
				await state.infinite.start()
			},
			prev: async ({ commit, dispatch, state }, payload) => {
				await state.infinite.prev(payload)
			},
			next: async ({ commit, dispatch, state }, payload) => {
				await state.infinite.next(payload)
			},
		}

		return namespaced ? this._withNamespace(res) : res
	}

	getMutations (namespaced = false) {
		let res = {
			cachedSet: (state, payload) => Vue.set(state, 'cached', { ...state.cached, ...payload }),
			loadingSet: (state, payload) => Vue.set(state, 'loading', { ...state.loading, ...payload }),
			completeSet: (state, payload) => Vue.set(state, 'complete', { ...state.complete, ...payload }),
			infiniteSet: (state, payload) => Vue.set(state, 'infinite', payload),
			infiniteDestroy: state => state.infinite ? state.infinite.reset() : null
		}

		return namespaced ? this._withNamespace(res) : res
	}

	getGetters (namespaced = false) {
		let res = {
			filters: state => state.filters,
		}

		return namespaced ? this._withNamespace(res) : res
	}

	_withNamespace (obj) {
		return Object.keys(obj)
			.reduce((prev, key) => (prev[this.namespace + this.namespacePrefix + key] = obj[key], prev), {})
	}

	_getNamespace(show = false) {
		return show ? this.namespace + this.namespacePrefix : ''
	}

	_log (...args) {
		console.log('[inf]', `[${this.namespace}]`, ...args)
	}

	_warn (...args) {
		console.warn('[inf]', `[${this.namespace}]`, ...args)
	}
}
