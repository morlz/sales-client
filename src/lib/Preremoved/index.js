import Vue from 'vue'

export default class Preremoved {
	cache = null

	constructor (namespace = 'preremoved', namespaced = true, namespacePrefix = '_') {
		if (typeof namespace == 'object') {
			let options = namespace
			this.namespace = options.namespace || 'preremoved'
			this.namespacePrefix = options.namespacePrefix || '_'
			this.namespaced = options.namespaced || true
			this.cache = options.cache &&
				typeof options.cache.set == 'function' &&
				typeof options.cache.get == 'function' ?
					options.cache
				:	null
		} else {
			this.namespace = namespace
			this.namespacePrefix = namespacePrefix
			this.namespaced = namespaced
		}
	}

	getState () {
		let res = {
			preremoved: {}
		}

		return this.namespaced ? this._withNamespace(res) : res
	}

	getActions () {
		let res = {}

		return this.namespaced ? this._withNamespace(res) : res
	}

	getMutations () {
		let res = {
			preremove: (state, f) => {
				if (this.cache !== null) {
					var index = this.cache.get(state).findIndex(f),
						removed = this.cache.get(state)[index]
				} else {
					var index = state.infinite.cached.findIndex(f),
						removed = state.infinite.cached[index]
				}

				if (index == -1)
				 	return

				Vue.set(
					state[this.preremoved],
					index,
					removed
				)

				if (this.cache !== null) {
					this.cache.set(state, this.cache.get(state).filter((el, index) => !f(el, index)))
				} else {
					state.infinite.cached = {
						view: state.infinite.cached.filter((el, index) => !f(el, index))
					}
				}
			},
			preremoveRestore: (state, f) => {
				let findedIndex = Object
					.keys(state[this.preremoved])
					.find(key => f(state[this.preremoved][key]))

				if (findedIndex === undefined)
					return

				let view = this.cache !== null ?
					this.cache.get(state)//.filter((el, index) => !f(el, index))
				:	state.infinite.cached

				view.splice(findedIndex, 0, state[this.preremoved][findedIndex])

				if (this.cache !== null) {
					this.cache.set(state, view)
				} else {
					state.infinite.cached = { view }
				}

				delete state[this.preremoved][findedIndex]
			},
			preremoveRemove: (state, f) => {
				let findedIndex = Object
					.keys(state[this.preremoved])
					.find(key => f(state[this.preremoved][key]))

				if (findedIndex === undefined)
					return

				delete state[this.preremoved][findedIndex]
			},
		}

		return this.namespaced ? this._withNamespace(res) : res
	}

	getGetters () {
		let res = {}

		return this.namespaced ? this._withNamespace(res) : res
	}

	get preremoved () {
		return this.namespaced ?
			this.namespace + this.namespacePrefix + 'preremoved'
		:	state.preremoved
	}

	_withNamespace (obj) {
		return Object.keys(obj)
			.reduce((prev, key) => (prev[this.namespace + this.namespacePrefix + key] = obj[key], prev), {})
	}
}
