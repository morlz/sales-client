import core from '@/api/core'

export default {
	async getLimited (params) {
		params = core.prepareArrays(params)

		return await core.invoke({
			method: "get",
			type: "furnitures",
			params
		})
	},
	async getOne (id) {
		return await core.invoke({
			method: "get",
			type: "furniture",
			data: {
				id
			}
		})
	},
	async getModels ({ filters, type }) {
		return await core.invoke({
			method: "get",
			type: "furnitures",
			params: {
				limit: 1e3,
				type,
				models: true,
				filters
			}
		})
	},
	async getNewModels () {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-models"
		})
	},
	async getNewTypes (model_id, palermo = null) {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-model-info",
			params: {
				model_id,
				palermo
			}
		})
	},
	async getNewDekor ({ model_id, type_id, palermo }) {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-dekor",
			params: {
				model_id,
				config_id: type_id,
				palermo
			}
		})
	},
	async getNewCat () {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-cat"
		})
	},
	async getNewCloth (params) {
		return await core.invoke({
			method: "get",
			type: "furnitures/new-cloth",
			params
		})
	},
	async getNewPrice (params) {
		params.palermo = false
		let n = {
			cloth: params.cloth,
			model_id: params.model_id,
			config_id: params.type_id,
			palermo: params.palermo,
			maxKat: +params.index - 1
		}

		let o = {
			tkod: params.cloth,
			mName: params.model_id,
			mPost: params.type_id,
			pTip: params.palermo,
			maxKat: +params.index - 1
		}

		let resNew = await core.invoke({
			method: "get",
			type: "furnitures/new-price",
			params: n
		})

		let resOld = await core.invoke({
			method: "get",
			type: "furnitures/old-price",
			params: o
		})

		let formated = {},
			formatedNew = {}

		if (resNew.data) {
			formatedNew = {
				code: +resNew.data.code,
				price: +resNew.data.price,
				priceOpt: +resNew.data.priceOpt,
				r: +!!resNew.data.r,
				price2: +resNew.data.price2,
				priceOpt2: +resNew.data.priceOpt2,
			}
		}

		if (resOld.data) {
			let splited = resOld.data.split(";")
			formated = {
				code: +splited[0],
				price: +splited[1],
				priceOpt: +splited[2],
				r: +!!splited[3],
				price2: splited[4] ? +splited[4] : 0,
				priceOpt2: splited[5] ? +splited[5] : 0,
			}
		}

		let [a, b] = [JSON.stringify(formated), JSON.stringify(formatedNew)]

		if (a != b && resOld.data != (resNew.data.error ? resNew.data.error.message : '123123123')) {
			let p = ''
			for (var prop in n)
				if (n.hasOwnProperty(prop))
					p += `${prop}=${n[prop]}&`


			console.log(formated, formatedNew, resOld.data, resNew.data, params, p)
		}




		return a == b || resOld.data == (resNew.data.error ? resNew.data.error.message : '123123123')
	}
}
