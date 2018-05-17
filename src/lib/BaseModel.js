const prefix = '_'

export default class BaseModel {
	constructor(args = false) {
		if (args)
			this._init(args)
	}

	definePropery(prop, Class, array = false) {
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
					this.definePropery(prop, array ? props[prop][0] : props[prop], array)
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
		splited.reduce((prev, el, index) => prev[el] ? prev[el] : prev[el] = (index + 1 == splited.length ? value : {}), this)
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
		return Object.assign( Object.create( Object.getPrototypeOf(this)), this)
	}
}
