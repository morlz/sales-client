import axios from 'axios'
import db from '@/api/tempDB'
import cookie from '@/api/cookie'
import EventEmitter from 'browser-event-emitter'
import path from 'path'
import auth from '@/api/auth'
import Vue from 'vue'


let _wait = (timeMax = 2e3, timeMin = 2e2) => new Promise(resolve => setTimeout(resolve, Math.random() * (timeMax - timeMin) + timeMin))

class ApiCore extends EventEmitter {
	constructor (options = {}) {
		super(arguments)
		this.protocol = options.protocol || 'http'

		if (process.env.NODE_ENV == 'development') console.log("[api] [core] init")
	}
	async invoke (params = {}) {
		//await _wait(1000, 1000) //emit real server
		if (!params.data) params.data = {}
		if (!params.params) params.params = {}
		let url = path.resolve(this.apiPath, params.type)
		//let url = `${params.type}`

		if (params.data.id !== undefined) url += `/${params.data.id}`
		params.url = url

		let token = auth.getToken()
		if (token) params.params.token = token

		//if (process.env.NODE_ENV == 'development') console.log("api request", params)
		try {
			let res = await axios(params)
			//if (process.env.NODE_ENV == 'development') console.log("[api] req", params)
			//if (process.env.NODE_ENV == 'development') console.log("[api] res", res)
			if (res.data && res.data.error) this.emit("error", res.data.error)
			return res || {}
		} catch (err) {
			if (process.env.NODE_ENV == 'development') console.log("[api] error", err)
			this.emit("error", err)
			return new Error("Ошибка подключения к серверу")
		}
	}

	prepareArrays (params) {
		for (var prop in params)
			if (params.hasOwnProperty(prop))
				if (typeof params[prop] == 'object' || Array.isArray(params[prop]))
					params[prop] = JSON.stringify(params[prop])


		return params
	}

	assignItem (path, payload, field = 'id') {
		if (!Array.isArray(path))
			return console.warn('[core] [assignItem] 1 st arg must be an Array')
		const findIndex = el => typeof field == 'function' ? field(el) == field(payload) : el[field] == payload[field]
		let index = path.findIndex(findIndex)
		if (index == -1)
			return console.warn('[core] [assignItem] cannot find item')

		Vue.set(path, index, {
			...path[index],
			...payload
		})
	}

	assignItems (source, items, field = 'id') {
		if (!Array.isArray(source))
			return console.warn('[core] [assignItems] source (arg 1) must be an Array')

		if (!Array.isArray(items))
			return console.warn('[core] [assignItems] items (arg 2) must be an Array')

		items.map(item => this.assignItem(source, item, field))
	}

	sortFnFactory (field, revert = false) {
		return (a, b) => {
			if (typeof field == 'function') {
				if (field(a) > field(b)) return revert ? 1 : -1
				if (field(a) < field(b)) return revert ? -1 : 1
			}
			if (a[field] > b[field]) return revert ? 1 : -1
			if (a[field] < b[field]) return revert ? -1 : 1
			return 0
		}
	}

	sortFnFactorySpecial (field, revert = false) {
		return (a, b) => {
			if ((a && typeof a.__sort === 'string') || (b && typeof b.__sort === 'string')) {
				if (a.__sort === b.__sort) return 0
				if (a.__sort === 'start') return -1
				if (b.__sort === 'start') return 1
				if (a.__sort === 'end') return 1
				if (b.__sort === 'end') return -1
			}

			if (typeof field == 'function') {
				if (field(a) > field(b)) return revert ? 1 : -1
				if (field(a) < field(b)) return revert ? -1 : 1
			}
			if (a[field] > b[field]) return revert ? 1 : -1
			if (a[field] < b[field]) return revert ? -1 : 1
			return 0
		}
	}

	get apiPath () {
		return process.env.NODE_ENV == 'development' ? `web` : `nsl/web`
	}


	async call (to, options = {}, method = 'get', i = 0) {
		const req = { [method === 'get' ? 'params' : 'data']: options }
		let args = [...Array.from(arguments)]
		//await this._wait(1000)

		let url = path.join(this.apiPath, to)

		req.params = { ...req.params, token: auth.getToken() }

		if (options.id !== undefined) {
			url = path.join(url, '/' + options.id)
			delete options.id
		}

		let res = {}
		//url = this.protocol + '://' + url

		try {
			res = await axios({ ...req, method, url })
		} catch (err) {
			console.log('err', { ...err }, err)

			if (err.response && err.response.status === 500 && i < 5) {
				console.log('err 500', i);
				await this._wait(5e2)

				console.log('err args', args)
				args[3] = ++i
				return await this.invoke(...args)
			}

			return {}
		}

		if (!res.data || res.data.error)
			return this.handleError(res)

		return res.data
	}

	async get (...args) {
		return await this.call(...args)
	}

	async post (...args) {
		return await this.call(...args, 'post')
	}

	async delete (...args) {
		return await this.call(...args, 'delete')
	}

	async put (...args) {
		return await this.call(...args, 'put')
	}

	handleError ({ data, status }) {
		this.emit('error', data.error || data)

		if (data.error)
			return this.emit('handledError', data.error)

		return this.emit('unhadledError', data)
	}

	_wait (time = 300) {
		return new Promise(resolve => setTimeout(resolve, time))
	}
}

const core = new ApiCore()
const { sortFnFactory, sortFnFactorySpecial } = core

export default core
export {
	sortFnFactory,
	sortFnFactorySpecial,
	_wait
}
