const prefix = '_'
import Vue from 'vue'

export default class BaseModel {
	constructor(args = false) {
		if (args)
			this._init(args)
	}

	defineProperty(prop, Class, array = false) {
		if (array) this[prefix + prop] = []

		Object.defineProperty(this, prop, {
			get() {
				if (array) {
					let arr = this[prefix + prop] || []
					if (!arr.every(el => el instanceof Class))
						this[prop] = arr
				}

				return this[prefix + prop]
			},
			set(val) {
				if (array) {
					if (!Array.isArray(val))
						return console.warn(prop + ' must be an Array')

					this[prefix + prop] = val.map(el => el instanceof Class ? el : new Class(el))
				} else {
					this[prefix + prop] = !val || val instanceof Class ? val : new Class(val)
				}
			}
		})
	}

	define (props, args = false) {
		for (var prop in props)
			if (props.hasOwnProperty(prop)) {
				if (typeof props[prop] == 'string') {
					this.translateProperty(prop, props[prop])
				} else {
					let array = Array.isArray(props[prop])
					this.defineProperty(prop, array ? props[prop][0] : props[prop], array)
				}
			}

		if (args)
			this._init(args)
	}

	translateProperty (prop, path) {
		Object.defineProperty(this, prop, {
			get () {
				return this._getProperty(path)
			},
			set (value) {
				this._setProperty(path, value)
			}
		})
	}

	_init (args) {
		for (var prop in args)
			if (args.hasOwnProperty(prop))
				this[prop] = args[prop]
	}

	_getProperty (path) {
		return path.split('.').reduce((prev, el) => prev[el] ? prev[el] : '', this)
	}

	_setProperty (path, value) {
		let splited = path.split('.')
		splited.reduce((prev, el, index) => prev[el] ? prev[el] : Vue.set(prev, el, index + 1 == splited.length ? value : {}), this)
	}

	get instance () {
		return this
	}

	update (val) {
		for (var prop in val)
			if (val.hasOwnProperty(prop))
				this[prop] = val[prop]

		return this
	}

	clone () {
		return new this.constructor(Object.getOwnPropertyNames(this).reduce((prev, el) => (prev[el] = this[el], prev), {}))
	}

	get href () {
		if (!this.baseUrl) return
		return this.constructor.format(this.baseUrl, this)
	}

	static format (template, data) {
		if (typeof template !== 'string')
			throw new Error('template mus be an instance of String')

		if (typeof data !== 'object' || data === null)
			throw new Error('data must be an Object with keys is template marks and values is String')

		return template.replace(/{(\w+)}/g, (m, p) => data[p])
	}

	static wrap (res, field = 'id') {
		if (res[field] !== undefined)
			return new this(res)

		return res
	}

	static wrapArray (res) {
		if (Array.isArray(res))
			return res.map(el => new this(el))

		return res
	}
}
