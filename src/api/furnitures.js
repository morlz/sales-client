import core from '@/api/core'
import { Cloth } from '@/lib'

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
			type: "furniture/new-models"
		})
	},
	async getNewTypes (model_id, palermo = null) {
		return await core.invoke({
			method: "get",
			type: "furniture/new-model-info",
			params: {
				model_id,
				palermo
			}
		})
	},
	async getNewDekor ({ model_id, type_id, palermo }) {
		return await core.invoke({
			method: "get",
			type: "furniture/new-dekor",
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
			type: "furniture/new-cat"
		})
	},
	async getNewCloth (params) {
		let res = await core.invoke({
			method: "get",
			type: "furniture/new-cloth",
			params
		})

		if (Array.isArray(res.data))
			res.data = res.data.map(el => el instanceof Cloth ? el : new Cloth(el))

		return res
	},
	async getNewClothById(params) {
		let res = await core.invoke({
			method: "get",
			type: "furniture/new-cloth-by-id",
			params
		})

		if (res.data && !res.data.error)
			res.data = res.data instanceof Cloth ? res.data : new Cloth(res.data)

		return res
	},
	async getNewPrice (params, debug = false) {

		// foramt request params
		let [ newParams, oldParams ] = [
			{
				cloth: params.cloth,
				model_id: params.model_id,
				config_id: params.type_id,
				palermo: params.palermo,
				maxKat: params.index
			},
			{
				tkod: params.cloth,
				mName: params.model_id,
				mPost: params.type_id,
				pTip: params.palermo,
				maxKat: params.index
			}
		]

		//do requests
		let [resNew, resOld] = await Promise.all([
			//new
			core.invoke({
				method: "get",
				type: "furniture/new-price",
				params: newParams
			}),
			//old
			core.invoke({
				method: "get",
				type: "furniture/old-price",
				params: oldParams
			})
		])

		//format responce
		let formated = {}, formatedNew = {}

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

		//obj to string and compare
		let [a, b] = [JSON.stringify(formated), JSON.stringify(formatedNew)],
			dataCorrect = a == b || resOld.data == (resNew.data.error ? resNew.data.error.message : '123123123')

		//is not correct notify
		if (!dataCorrect) {
			let paths = {
				o: '',
				n: ''
			}
			for (var prop in newParams)
				if (newParams.hasOwnProperty(prop))
					paths.n += `${prop}=${newParams[prop]}&`
			for (var prop in oldParams)
				if (oldParams.hasOwnProperty(prop))
					paths.o += `${prop}=${oldParams[prop]}&`

			console.log({
				formated: {
					o: formated,
					n: formatedNew
				},
				responseData: {
					o: resOld.data,
					n: resNew.data,
				},
				params,
				paths
			})

			//core.emit('alert', { title: "Используется старая версия", message: "Расхождение данных старой иновой версии подробнее в консоле" })
		}

		// emit default api work
		if (dataCorrect && resNew.data.error)
			return resNew.data


		if (debug) return dataCorrect
		//is not correct use old
		return formatedNew
		// tactical use
		//return dataCorrect ? formatedNew : formated
	},
	async getNewClothInfo (cloth) {
		cloth = cloth.ITEMID || cloth

		return await core.invoke({
			method: "get",
			type: "furniture/cloth-info",
			params: {
				cloth
			}
		})
	},
	async getDiscountPrice ({ model_id, cat, price }) {
		return await core.invoke({
			method: "get",
			type: "furniture/new-discount-price",
			params: {
				model_id,
				cat,
				order: 0,
				price
			}
		})
	},
	async updateZak (data) {
		return await core.invoke({
			method: "put",
			type: "furniture",
			data
		})
	},
	async transferTake (data) {
		return await core.invoke({
			method: "post",
			type: "transfer/take",
			data
		})
	},
	async moveToSalon(data) {
		return await core.invoke({
			method: "post",
			type: "cart/sofa-move",
			data
		})
	},
	async updateTdDiscount (data) {
		return await core.invoke({
			method: 'put',
			type: 'discount/update-td',
			data
		})
	}
}
