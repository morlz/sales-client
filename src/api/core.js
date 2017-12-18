import axios from 'axios'
import db from '@/api/tempDB'

let _wait = (timeMax = 2e3, timeMin = 2e2) => {
	return new Promise(resolve => setTimeout(resolve, Math.random() * (timeMax - timeMin) + timeMin))
}

export default {
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
	},
	async invoke (params = {}) {
		//await _wait(10000, 5000) //emit real server
		if (!params.data) params.data = {}

		let url
		if (process.env.NODE_ENV == 'development') {
			url = `http://localhost/sales-server/web/${params.type}`
		} else {
			url = `/sales-server/web/${params.type}`
		}

		if (params.data.id !== undefined) url += `/${params.data.id}`
		params.url = url

		if (process.env.NODE_ENV == 'development') console.log("api request", params)
		let res = await axios(params)
		if (process.env.NODE_ENV == 'development') console.log("api response", res)
		return res
	},
	prepareArrays (params) {
		for (var prop in params) {
			if (params.hasOwnProperty(prop)) {
				params[prop] = JSON.stringify(params[prop])
			}
		}
		return params
	}
}
