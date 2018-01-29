import axios from 'axios'
import db from '@/api/tempDB'
import cookie from '@/api/cookie'
import EventEmitter from 'browser-event-emitter'


let _wait = (timeMax = 2e3, timeMin = 2e2) => new Promise(resolve => setTimeout(resolve, Math.random() * (timeMax - timeMin) + timeMin))

class Core extends EventEmitter {
	constructor () {
		super(arguments)
		if (process.env.NODE_ENV == 'development') console.log("[api] [core] init")
	}

	async fakeInvoke (params = {}) {
		if (!params.data) params.data = {}
		await _wait()
		let rez = { data: { error: { message: "Not found" } }, status: 404 }

		if (params.data.id !== undefined) {
			if (db[params.type][params.data.id]) {
				rez.data = db[params.type][params.data.id]
				rez.status = 200
				return rez
			}
		}

		if (params.data.phone !== undefined) {
			if (db[params.type]) {
				rez.data = db[params.type].filter(el => el.phone.indexOf(params.data.phone) + 1 || el.name.toLowerCase().indexOf(params.data.phone.toLowerCase()) + 1)
				rez.status = 200
				return rez
			}
		}

		if (params.data.id === undefined) {
			if (db[params.type]) {
				rez.data = db[params.type]
				rez.status = 200
				return rez
			}
		}

		return rez
	}

	async invoke (params = {}) {
		//await _wait(10000, 5000) //emit real server
		if (!params.data) params.data = {}
		if (!params.params) params.params = {}
		let url = process.env.NODE_ENV == 'development' ? `${params.type}` : `web/${params.type}`
		//let url = `${params.type}`

		if (params.data.id !== undefined) url += `/${params.data.id}`
		params.url = url

		let auth = cookie.getAuth()
		if (auth && auth.token) params.params.token = auth.token

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
		for (var prop in params) {
			if (params.hasOwnProperty(prop)) {
				if (typeof params[prop] == 'object' || Array.isArray(params[prop])) params[prop] = JSON.stringify(params[prop])
			}
		}
		return params
	}

	assignItem (path, payload, field = "id") {
		if (!path) return
		let data = path.find(el => el[field] == payload[field])
		if (!data) return
		for (var prop in payload) if (payload.hasOwnProperty(prop)) data[prop] = payload[prop]
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
}

export default new Core()
